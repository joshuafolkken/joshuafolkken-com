#!/usr/bin/env node
/* eslint-disable no-console */
import { spawnSync, type SpawnSyncOptions } from 'node:child_process'
import { EOL } from 'node:os'
import { exit, stdin as input, stdout as output } from 'node:process'
import { createInterface, type Interface } from 'node:readline/promises'
import type { CommandOptions, CommandResult } from './git-ops/command-types.js'
import { AutomationError, error_utilities } from './git-ops/error-utilities.js'
import { create_git_helpers } from './git-ops/git-helpers.js'
import { prompt_utilities, type Operation } from './git-ops/prompt-utilities.js'
import { retry_helpers, type RetryConfig, type RetryStepResult } from './git-ops/retry-helpers.js'

const PACKAGE_JSON_FILE = 'package.json'
const OPERATION_CANCELLED_MESSAGE = 'Operation cancelled by user.'
const CHECK_LABEL = 'Checks'
const REPORT_LABEL = 'Report'
const RETRY_FAILURE_LABELS = {
	checks: 'CI watch failed.',
	report: 'CI report failed.',
} as const
type RetryFailureLabelKey = keyof typeof RETRY_FAILURE_LABELS

type PendingCheckOutcome = 'retry' | 'complete' | 'unhandled'

interface AutomationConfig {
	issue_title: string
	issue_number: string
	target_branch: string
	operations: Record<Operation, boolean>
}

interface ResolvedCommandOptions {
	stdio: 'pipe' | 'inherit'
	should_allow_non_zero_exit: boolean
	description: string | undefined
	env: NodeJS.ProcessEnv | undefined
	should_lead_with_blank_line: boolean
}

interface CommandContext {
	description: string | undefined
	start_message: string | undefined
	is_inline_status: boolean
	should_lead_with_blank_line: boolean
}

function resolve_command_options(options: CommandOptions = {}): ResolvedCommandOptions {
	return {
		stdio: options.stdio ?? 'pipe',
		should_allow_non_zero_exit: options.should_allow_non_zero_exit ?? false,
		description: options.description,
		env: options.env,
		should_lead_with_blank_line: options.should_lead_with_blank_line ?? false,
	}
}

function build_retry_error_by_key(key: RetryFailureLabelKey, details?: string): AutomationError {
	return error_utilities.build_retry_failure_error(RETRY_FAILURE_LABELS[key], details)
}

function create_command_context(
	description: string | undefined,
	stdio: 'pipe' | 'inherit',
	should_lead_with_blank_line: boolean,
): CommandContext {
	return {
		description,
		start_message: description === undefined ? undefined : `⏳ ${description}`,
		is_inline_status: description !== undefined && stdio === 'pipe',
		should_lead_with_blank_line,
	}
}

function write_log_line(is_inline_status: boolean): void {
	if (is_inline_status) {
		output.write(EOL)
		return
	}

	console.log('')
}

function log_command_start(context: CommandContext): void {
	if (context.start_message === undefined) return

	if (context.should_lead_with_blank_line) {
		write_log_line(context.is_inline_status)
	}

	if (context.is_inline_status) {
		output.write(context.start_message)
		return
	}

	console.log(context.start_message)
}

function create_spawn_options(
	stdio: 'pipe' | 'inherit',
	environment: NodeJS.ProcessEnv | undefined,
): SpawnSyncOptions {
	return {
		stdio: stdio === 'pipe' ? ['ignore', 'pipe', 'pipe'] : 'inherit',
		encoding: stdio === 'pipe' ? 'utf8' : undefined,
		env: environment === undefined ? process.env : { ...process.env, ...environment },
	}
}

function throw_on_spawn_error(result: ReturnType<typeof spawnSync>, context: CommandContext): void {
	if (result.error === undefined) return

	const summary =
		context.description === undefined ? result.error.message : `${context.description} failed`
	const details = context.description === undefined ? undefined : result.error.message
	const message = error_utilities.format_failure_message(summary, details)

	throw new AutomationError(message, { cause: result.error })
}

function build_command_result(result: ReturnType<typeof spawnSync>): CommandResult {
	return {
		status: result.status ?? 0,
		stdout: typeof result.stdout === 'string' ? result.stdout : '',
		stderr: typeof result.stderr === 'string' ? result.stderr : '',
	}
}

function report_failure_status(context: CommandContext): void {
	if (context.description === undefined) return

	const fail_message = `❌ ${context.description}`
	const reference_length = context.start_message?.length ?? fail_message.length
	const padding = Math.max(0, reference_length - fail_message.length)

	if (context.is_inline_status) {
		output.write(`\r${fail_message}${' '.repeat(padding)}\n`)
		return
	}

	if (context.should_lead_with_blank_line) {
		console.error('')
	}

	console.error(fail_message)
}

function ensure_success_status(
	result: CommandResult,
	context: CommandContext,
	should_allow_non_zero_exit: boolean,
	command: string,
	arguments_list: Array<string>,
): void {
	if (should_allow_non_zero_exit || result.status === 0) return

	report_failure_status(context)

	const trimmed_stderr = result.stderr.trim()
	const summary =
		context.description === undefined
			? `Command execution failed: ${command} ${arguments_list.join(' ')}`
			: `${context.description} failed.`
	const message = error_utilities.format_failure_message(summary, trimmed_stderr)

	throw new AutomationError(message)
}

function report_success_status(
	result: CommandResult,
	context: CommandContext,
	should_allow_non_zero_exit: boolean,
): void {
	if (context.description === undefined) return
	if (!should_allow_non_zero_exit && result.status !== 0) return

	const success_message = `✅ ${context.description}`
	const reference_length = context.start_message?.length ?? success_message.length
	const padding = Math.max(0, reference_length - success_message.length)

	if (context.is_inline_status) {
		output.write(`\r${success_message}${' '.repeat(padding)}\n`)
		return
	}

	if (context.should_lead_with_blank_line) {
		console.log('')
	}

	console.log(success_message)
}

async function read_piped_input(): Promise<string | undefined> {
	if (input.isTTY) {
		return undefined
	}

	return await new Promise<string>((resolve) => {
		let data = ''
		input.setEncoding('utf8')
		input.on('data', (chunk: string) => {
			data += chunk
		})
		input.on('end', () => {
			resolve(data)
		})
	})
}

function ensure_prompt_interface(prompt: Interface | undefined): Interface {
	if (prompt === undefined) {
		throw new AutomationError(
			'Interactive input is required. Please rerun this script in a TTY environment.',
		)
	}
	return prompt
}

async function read_issue_line(prompt: Interface | undefined): Promise<string> {
	const piped_input = await read_piped_input()

	if (piped_input !== undefined) {
		const raw_lines = piped_input
			.split(/\r?\n/u)
			.map((line) => line.trim())
			.filter((line) => line.length > 0)

		const lines = raw_lines[0]?.trim() === '@git-automation.md' ? raw_lines.slice(1) : raw_lines

		if (lines.length === 0) {
			throw new AutomationError(
				'Input is missing. Please provide a line that includes issue information.',
			)
		}

		return lines[0] ?? ''
	}

	const rl = ensure_prompt_interface(prompt)
	const issue_line = await rl.question('\nIssue info (<title> #<number>): ')

	return issue_line.trim()
}

function parse_issue_line(line: string): { issue_title: string; issue_number: string } {
	const normalized = line.replace(/^issue:\s*/iu, '').trim()
	const hash_index = normalized.lastIndexOf('#')

	if (hash_index <= 0) {
		throw new AutomationError('Issue information is malformed. Use the format `<title> #<number>`.')
	}

	const raw_title = normalized.slice(0, hash_index).trim()
	const raw_number = normalized.slice(hash_index + 1).trim()
	const number_match = /\d+/u.exec(raw_number)

	if (raw_title.length === 0 || number_match === null) {
		throw new AutomationError('Issue information is malformed. Check the title and number.')
	}

	return {
		issue_title: raw_title,
		issue_number: number_match[0],
	}
}

function sanitize_branch_slug(title: string): string {
	const replaced = title
		.toLowerCase()
		.normalize('NFKD')
		.replaceAll(/[^a-z0-9]+/gu, '-')
		.replaceAll(/-+/gu, '-')
		.replaceAll(/(^-)|(-$)/gu, '')

	return replaced.length === 0 ? 'update' : replaced
}

function generate_target_branch(issue_title: string, issue_number: string): string {
	const slug = sanitize_branch_slug(issue_title)
	return `${issue_number}-${slug}`
}

function parse_automation_config(issue_line: string): AutomationConfig {
	const { issue_title, issue_number } = parse_issue_line(issue_line)
	const target_branch = generate_target_branch(issue_title, issue_number)

	return {
		issue_title,
		issue_number,
		target_branch,
		operations: {
			commit: false,
			push: false,
			pr: false,
		},
	}
}

function run_command(
	command: string,
	arguments_list: Array<string>,
	options: CommandOptions = {},
): CommandResult {
	const resolved_options = resolve_command_options(options)
	const { stdio, should_allow_non_zero_exit, env, description, should_lead_with_blank_line } =
		resolved_options

	const context = create_command_context(description, stdio, should_lead_with_blank_line)
	log_command_start(context)

	const spawn_options = create_spawn_options(stdio, env)
	const raw_result = spawnSync(command, arguments_list, spawn_options)
	throw_on_spawn_error(raw_result, context)

	const result = build_command_result(raw_result)
	ensure_success_status(result, context, should_allow_non_zero_exit, command, arguments_list)
	report_success_status(result, context, should_allow_non_zero_exit)

	return result
}

const {
	ensure_staging_state,
	get_staged_files,
	ensure_main_is_updated,
	create_branch,
	get_current_branch,
} = create_git_helpers(run_command)

function fetch_pr_checks_output(branch: string): { status: number; output: string } {
	const result = run_command('gh', ['pr', 'checks', branch], {
		stdio: 'pipe',
		should_allow_non_zero_exit: true,
	})

	const combined_output = [result.stdout, result.stderr]
		.filter((value) => value.trim().length > 0)
		.join('\n')

	return {
		status: result.status,
		output: combined_output.trim(),
	}
}

function is_existing_pr_message(command_output: string): boolean {
	const normalized = command_output.toLowerCase()
	return normalized.includes('pull request') && normalized.includes('already exists')
}

function is_no_checks_reported_message(command_output: string): boolean {
	return command_output.toLowerCase().includes('no checks reported')
}

function has_pending_checks_message(command_output: string): boolean {
	const normalized = command_output.toLowerCase()
	return /\b(pending|in progress|queued)\b/u.test(normalized)
}

function ensure_command_exists(command: string): void {
	const result = spawnSync(command, ['--version'], { stdio: 'ignore' })

	if (result.error !== undefined || result.status !== 0) {
		throw new AutomationError(
			`⚠️ ${command} is not installed. Install it if necessary and rerun this script.`,
		)
	}
}

function extract_branch_issue_number(branch: string): string | undefined {
	const match = /^(\d+)-/u.exec(branch)
	return match?.[1]
}

function ensure_branch_matches_issue(branch: string, issue_number: string): void {
	if (branch === 'main' || branch === 'master') return

	const branch_issue = extract_branch_issue_number(branch)
	if (branch_issue !== undefined && branch_issue !== issue_number) {
		throw new AutomationError(
			[
				'🚫 The issue number does not match the branch number.',
				`  Issue number: #${issue_number}`,
				`  Current branch: ${branch}`,
				'Switch to the correct branch or create a new one, then rerun this script.',
			].join(EOL),
		)
	}
}

function ensure_issue_matches(config: AutomationConfig): void {
	ensure_command_exists('gh')

	const { stdout } = run_command(
		'gh',
		['issue', 'view', config.issue_number, '--json', 'title', '--jq', '.title'],
		{
			description: 'Validate issue information',
		},
	)

	const github_title = stdout.trim()
	if (github_title.length === 0) {
		throw new AutomationError(`🚫 Issue #${config.issue_number} was not found.`)
	}

	if (github_title !== config.issue_title) {
		throw new AutomationError(
			[
				'🚫 Issue title does not match.',
				`  Provided title: ${config.issue_title}`,
				`  GitHub title:   ${github_title}`,
				'Verify the issue number and title.',
			].join(EOL),
		)
	}
}

async function confirm_package_json_presence(
	staged_files: Array<string>,
	rl: Interface,
): Promise<boolean> {
	if (staged_files.includes(PACKAGE_JSON_FILE)) return true

	const should_continue = await prompt_utilities.ask_yes_no_binary(
		rl,
		'⚠️ package.json is not included in the staged changes. Continue? (y/n): ',
	)

	if (!should_continue) {
		throw new AutomationError(OPERATION_CANCELLED_MESSAGE)
	}

	return false
}

function read_package_json_diff(): string {
	return run_command('git', ['diff', '--cached', PACKAGE_JSON_FILE], {
		description: 'Inspect package.json diff',
	}).stdout
}

async function confirm_package_version_update(diff: string, rl: Interface): Promise<void> {
	const has_version_change = /^[+-]\s*"version"\s*:/gmu.test(diff)
	if (has_version_change) return

	const should_continue = await prompt_utilities.ask_yes_no_binary(
		rl,
		'⚠️ The package.json version has not been updated. Continue? (y/n): ',
	)

	if (!should_continue) {
		throw new AutomationError(OPERATION_CANCELLED_MESSAGE)
	}
}

async function ensure_package_json_version(prompt: Interface | undefined): Promise<void> {
	const rl = ensure_prompt_interface(prompt)
	const staged_files = get_staged_files()

	const has_package_json = await confirm_package_json_presence(staged_files, rl)
	if (!has_package_json) return

	const diff = read_package_json_diff()
	await confirm_package_version_update(diff, rl)
}

async function configure_operations(
	prompt: Interface | undefined,
): Promise<Record<Operation, boolean>> {
	const rl = ensure_prompt_interface(prompt)

	for (;;) {
		const operations = await prompt_utilities.prompt_operations_once(rl)
		prompt_utilities.log_operation_summary(operations)
		const is_confirmed = await prompt_utilities.ask_yes_no_binary(rl, '➡️ Proceed? (y/n): ')
		if (is_confirmed) {
			return operations
		}

		console.log('🔁 Reconfigure.')
	}
}

function run_commit(config: AutomationConfig): void {
	const commit_message = `${config.issue_title} #${config.issue_number}`
	run_command('git', ['commit', '-m', commit_message], {
		stdio: 'inherit',
		description: 'git commit',
	})
}

function run_push(branch: string): void {
	run_command('git', ['push', '-u', 'origin', branch], {
		stdio: 'inherit',
		description: 'git push',
	})
}

function build_pr_arguments(config: AutomationConfig): Array<string> {
	const title = `${config.issue_title} #${config.issue_number}`
	const body = `closes #${config.issue_number}`

	return [
		'pr',
		'create',
		'--title',
		title,
		'--body',
		body,
		'--label',
		'enhancement',
		'--base',
		'main',
	]
}

function collect_command_output(result: CommandResult): string {
	return [result.stdout, result.stderr]
		.filter((value) => value.trim().length > 0)
		.join('\n')
		.trim()
}

function handle_pr_creation_result(result: CommandResult, command_output: string): void {
	if (result.status === 0) {
		if (command_output.length > 0) {
			console.log(command_output)
		}
		console.log('✅ 🔀 PR')
		return
	}

	if (is_existing_pr_message(command_output)) {
		console.log('ℹ️ Existing PR reused.')
		console.log('✅ 🔀 PR')
		return
	}

	console.log('❌ 🔀 PR')

	const command_output_suffix = command_output.length > 0 ? `\n${command_output}` : ''
	throw new AutomationError(`Failed to create PR.${command_output_suffix}`)
}

function create_pull_request(config: AutomationConfig): void {
	console.log(`\n${prompt_utilities.OPERATION_LABELS.pr}`)

	const result = run_command('gh', build_pr_arguments(config), {
		stdio: 'pipe',
		should_allow_non_zero_exit: true,
		description: 'gh pr create',
	})

	const command_output = collect_command_output(result)
	handle_pr_creation_result(result, command_output)
}

interface CheckPhaseMessages {
	pending_not_ready: string
	pending_in_progress: string
	final_not_ready: string
	final_in_progress: string
}

function evaluate_check_phase(
	command_output: string,
	attempt: number,
	max_attempts: number,
	messages: CheckPhaseMessages,
): PendingCheckOutcome {
	const is_pending =
		is_no_checks_reported_message(command_output) || has_pending_checks_message(command_output)
	if (!is_pending) {
		return 'unhandled'
	}

	const is_no_checks = is_no_checks_reported_message(command_output)

	if (attempt < max_attempts) {
		const reason = is_no_checks ? messages.pending_not_ready : messages.pending_in_progress
		console.log(`${reason} Retry soon.`)
		return 'retry'
	}

	const final_reason = is_no_checks ? messages.final_not_ready : messages.final_in_progress
	console.log(final_reason)
	return 'complete'
}

function evaluate_pending_checks(
	command_output: string,
	attempt: number,
	max_attempts: number,
): PendingCheckOutcome {
	return evaluate_check_phase(command_output, attempt, max_attempts, {
		pending_not_ready: 'CI not registered yet.',
		pending_in_progress: 'CI still pending.',
		final_not_ready: 'CI never registered. Continuing.',
		final_in_progress: 'CI still pending. Continuing.',
	})
}

function run_watch_command_once(branch: string): CommandResult {
	return run_command('gh', ['pr', 'checks', '--watch', branch], {
		stdio: 'inherit',
		should_allow_non_zero_exit: true,
	})
}

function fetch_check_output(branch: string): string {
	const { output: check_output } = fetch_pr_checks_output(branch)
	return check_output
}

function evaluate_watch_retry(
	branch: string,
	attempt: number,
	max_attempts: number,
): RetryStepResult<undefined> {
	const command_output = fetch_check_output(branch)
	const pending_outcome = evaluate_pending_checks(command_output, attempt, max_attempts)

	if (pending_outcome === 'retry') {
		return {
			status: 'retry',
			details: { message: command_output, raw_output: command_output },
		}
	}

	if (pending_outcome === 'complete') {
		return {
			status: 'success',
			value: undefined,
			details: { message: command_output, raw_output: command_output },
		}
	}

	throw build_retry_error_by_key('checks', command_output)
}

function create_watch_retry_config(branch: string): RetryConfig<undefined> {
	return {
		label: CHECK_LABEL,
		execute({ attempt, max_attempts }) {
			const result = run_watch_command_once(branch)
			if (result.status === 0) {
				return {
					status: 'success',
					value: undefined,
					details: { message: result.stdout, raw_output: result.stdout },
				}
			}

			return evaluate_watch_retry(branch, attempt, max_attempts)
		},
		retry_delay_ms: retry_helpers.DEFAULT_RETRY_DELAY_MS,
	}
}

async function watch_pull_request_checks(branch: string): Promise<void> {
	await retry_helpers.wait_for(retry_helpers.DEFAULT_RETRY_DELAY_MS)
	await retry_helpers.retry_with_status(create_watch_retry_config(branch))
}

function parse_pr_info(stdout: string): { url?: string; title?: string } {
	try {
		return JSON.parse(stdout) as { url?: string; title?: string }
	} catch (error) {
		throw new AutomationError('PR info failed. JSON parse error.', { cause: error })
	}
}

function fetch_pr_info(branch: string): { url?: string; title?: string } {
	const { stdout } = run_command('gh', ['pr', 'view', branch, '--json', 'url,title,number'], {
		description: 'PR info',
	})
	return parse_pr_info(stdout)
}

function evaluate_report_status(
	command_output: string,
	attempt: number,
	max_attempts: number,
): PendingCheckOutcome {
	return evaluate_check_phase(command_output, attempt, max_attempts, {
		pending_not_ready: 'CI report not ready.',
		pending_in_progress: 'CI report pending.',
		final_not_ready: 'CI report never arrived. Continuing.',
		final_in_progress: 'CI report still pending. Continuing.',
	})
}

function extract_sonar_line(command_output: string): string | undefined {
	return command_output.split(/\r?\n/u).find((line) => line.toLowerCase().includes('sonarcloud'))
}

function sonar_checks_failed(line: string | undefined): boolean {
	if (line === undefined) return false

	const normalized = line.toLowerCase()
	return !normalized.includes('pass') && !normalized.includes('success')
}

function resolve_sonar_url(line: string | undefined, pr_info: { url?: string }): string {
	if (line === undefined) return pr_info.url ?? ''

	const match = /https?:\/\/\S+/u.exec(line)
	return match?.[0] ?? pr_info.url ?? ''
}

function enforce_sonar_success(
	command_output: string,
	pr_info: { url?: string; title?: string },
): void {
	const sonar_line = extract_sonar_line(command_output)
	if (!sonar_checks_failed(sonar_line)) return

	const sonar_url = resolve_sonar_url(sonar_line, pr_info)
	throw new AutomationError(
		['⚠️ SonarCloud found issues.', `Details: ${sonar_url}`, 'Fix, commit, push, rerun.'].join(EOL),
	)
}

function evaluate_report_retry(
	command_output: string,
	attempt: number,
	max_attempts: number,
): RetryStepResult<string> {
	const outcome = evaluate_report_status(command_output, attempt, max_attempts)

	if (outcome === 'retry') {
		return {
			status: 'retry',
			details: { message: command_output, raw_output: command_output },
		}
	}

	if (outcome === 'complete') {
		return {
			status: 'success',
			value: command_output,
			details: { message: command_output, raw_output: command_output },
		}
	}

	throw build_retry_error_by_key('report', command_output)
}

function build_report_retry_config(branch: string): RetryConfig<string> {
	return {
		label: REPORT_LABEL,
		execute({ attempt, max_attempts }) {
			const { status, output: command_output } = fetch_pr_checks_output(branch)

			if (status === 0) {
				return {
					status: 'success',
					value: command_output,
					details: { message: command_output, raw_output: command_output },
				}
			}

			return evaluate_report_retry(command_output, attempt, max_attempts)
		},
	}
}

async function collect_report_output(branch: string): Promise<string> {
	return await retry_helpers.retry_with_status(build_report_retry_config(branch))
}

async function evaluate_sonar_checks(branch: string): Promise<{ url?: string; title?: string }> {
	const pr_info = fetch_pr_info(branch)
	const report_output = await collect_report_output(branch)
	enforce_sonar_success(report_output, pr_info)
	return pr_info
}

function summarize_operations(config: AutomationConfig): string {
	const enabled = Object.entries(config.operations)
		.filter(([, value]) => value)
		.map(([key]) => prompt_utilities.OPERATION_LABELS[key as Operation])
	return enabled.length > 0 ? enabled.join(' · ') : 'none'
}

async function prepare_config(prompt: Interface | undefined): Promise<AutomationConfig> {
	const issue_line = await read_issue_line(prompt)
	return parse_automation_config(issue_line)
}

interface BranchAlignmentResult {
	target_branch_name: string
	should_pull_main: boolean
	should_create_branch: boolean
	should_warn_about_name: boolean
}

const resolve_branch_alignment = (
	config: AutomationConfig,
	current_branch: string,
): BranchAlignmentResult => {
	const is_on_main = current_branch === 'main' || current_branch === 'master'

	if (is_on_main) {
		const should_create_branch = current_branch !== config.target_branch
		return {
			target_branch_name: should_create_branch ? config.target_branch : current_branch,
			should_pull_main: true,
			should_create_branch,
			should_warn_about_name: false,
		}
	}

	return {
		target_branch_name: current_branch,
		should_pull_main: false,
		should_create_branch: false,
		should_warn_about_name: current_branch !== config.target_branch,
	}
}

function align_working_branch(config: AutomationConfig): string {
	let current_branch = get_current_branch()

	ensure_branch_matches_issue(current_branch, config.issue_number)

	const alignment = resolve_branch_alignment(config, current_branch)

	if (alignment.should_pull_main) {
		ensure_main_is_updated(current_branch)
	}

	if (alignment.should_create_branch) {
		create_branch(alignment.target_branch_name)
		current_branch = alignment.target_branch_name
	}

	if (alignment.should_warn_about_name) {
		console.log(
			`⚠️ The current branch (${current_branch}) differs from the recommended branch name (${config.target_branch}). Continuing on the existing branch.`,
		)
	}

	return alignment.target_branch_name
}

async function execute_setup(
	prompt: Interface | undefined,
): Promise<{ config: AutomationConfig; current_branch: string }> {
	ensure_staging_state()
	await ensure_package_json_version(prompt)

	const config = await prepare_config(prompt)
	const current_branch = align_working_branch(config)

	ensure_issue_matches(config)
	console.log('✅ Pre-flight checks')

	return { config, current_branch }
}

async function select_operations(
	prompt: Interface | undefined,
	config: AutomationConfig,
): Promise<void> {
	config.operations = await configure_operations(prompt)

	const summary = summarize_operations(config)
	console.log(`\n🚀 Run → #${config.issue_number} ${config.issue_title} · ${summary}`)
}

function run_commit_if_requested(config: AutomationConfig): void {
	if (!config.operations.commit) return

	console.log(`\n${prompt_utilities.OPERATION_LABELS.commit}`)
	run_commit(config)
}

function run_push_if_requested(config: AutomationConfig, current_branch: string): void {
	if (!config.operations.push) return

	console.log(`\n${prompt_utilities.OPERATION_LABELS.push}`)
	run_push(current_branch)
}

function log_pr_completion(pr_info: { url?: string; title?: string }): void {
	console.log('\n────────')
	console.log('\n🏁 All operations complete')

	if (pr_info.url !== undefined) {
		console.log('\n📦 PR:')
		console.log(`  • URL: ${pr_info.url}`)
	}

	if (pr_info.title !== undefined) {
		console.log(`  • Title: ${pr_info.title}`)
	}

	console.log('  • Status: ✅ All checks passed')
	console.log('\n👉 Request code review.')
}

async function run_pr_flow_if_requested(
	config: AutomationConfig,
	current_branch: string,
): Promise<boolean> {
	if (!config.operations.pr) return false

	create_pull_request(config)

	console.log('\n🧪 CI')
	await watch_pull_request_checks(current_branch)

	console.log('\n🧾 Report')
	const pr_info = await evaluate_sonar_checks(current_branch)
	log_pr_completion(pr_info)

	return true
}

function log_partial_completion(): void {
	console.log('\n────────')
	console.log('🏁 Selected steps done')
}

async function execute_workflow(config: AutomationConfig, current_branch: string): Promise<void> {
	run_commit_if_requested(config)
	run_push_if_requested(config, current_branch)

	const did_execute_pr = await run_pr_flow_if_requested(config, current_branch)
	if (!did_execute_pr) log_partial_completion()
}

function handle_automation_error(error: unknown): never {
	if (error instanceof AutomationError) {
		console.error(error.message)
		exit(1)
	}

	if (error instanceof Error) {
		console.error(`An unexpected error occurred: ${error.message}`)
		exit(1)
	}

	console.error('An unexpected error occurred.')
	exit(1)
}

async function main(): Promise<void> {
	const prompt = process.stdin.isTTY ? createInterface({ input, output }) : undefined

	try {
		const { config, current_branch } = await execute_setup(prompt)
		await select_operations(prompt, config)
		await execute_workflow(config, current_branch)
	} catch (error) {
		handle_automation_error(error)
	} finally {
		prompt?.close()
	}
}

await main()
