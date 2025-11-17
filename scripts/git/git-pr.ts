import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { animation_helpers } from './animation-helpers.js'
import { git_command } from './git-command.js'

const exec_async = promisify(exec)

const WAIT_AFTER_PR_SECONDS = 5
const SECONDS_TO_MILLISECONDS = 1000
const COUNTDOWN_INTERVAL_MS = 1000
const COUNTDOWN_PADDING = 20

function clear_countdown_line(message_length: number): void {
	const clear_length = message_length + COUNTDOWN_PADDING
	process.stdout.write(`\r${' '.repeat(clear_length)}\r`)
}

function update_countdown_display(message: string, remaining: number): void {
	process.stdout.write(`\r${message} (${String(remaining)}s)`)
}

function create_countdown_interval(message: string, total_seconds: number): NodeJS.Timeout {
	let remaining_seconds = total_seconds
	update_countdown_display(message, remaining_seconds)

	return setInterval(() => {
		remaining_seconds -= 1
		if (remaining_seconds > 0) {
			update_countdown_display(message, remaining_seconds)
		} else {
			clear_countdown_line(message.length)
		}
	}, COUNTDOWN_INTERVAL_MS)
}

async function wait_for_seconds(seconds: number, countdown_message?: string): Promise<void> {
	if (countdown_message === undefined || !process.stdout.isTTY) {
		await new Promise((resolve) => {
			setTimeout(resolve, seconds * SECONDS_TO_MILLISECONDS)
		})
		return
	}

	const interval_id = create_countdown_interval(countdown_message, seconds)

	await new Promise((resolve) => {
		setTimeout(resolve, seconds * SECONDS_TO_MILLISECONDS)
	})

	clearInterval(interval_id)
	clear_countdown_line(countdown_message.length)
}

function is_pr_already_exists_message(message: string): boolean {
	return message === 'PR_ALREADY_EXISTS'
}

function check_error_cause(error: Error): boolean {
	return error.cause instanceof Error && is_pr_already_exists_message(error.cause.message)
}

function is_pr_already_exists_error(error: unknown): boolean {
	if (error instanceof Error) {
		if (is_pr_already_exists_message(error.message)) {
			return true
		}
		return check_error_cause(error)
	}
	return false
}

async function create_pr(title: string, body: string): Promise<void> {
	try {
		await animation_helpers.execute_with_animation(
			'Creating pull request...',
			async () => {
				await git_command.pr_create(title, body)
				return 'PR created.'
			},
			{
				icon_selector: () => '✅',
				error_message: 'Failed to create PR',
				result_formatter: (message) => message,
			},
		)
	} catch (error) {
		if (is_pr_already_exists_error(error)) {
			console.info('')
			console.info('ℹ️  Pull request already exists.')
			console.info('')
			return
		}
		throw error
	}
}

const MERGE_STATE_DIRTY = 'dirty'
const MERGE_STATE_BLOCKED = 'blocked'
const MERGEABLE_CONFLICTING = 'CONFLICTING'
const CONFLICT_MESSAGE = 'This branch has conflicts that must be resolved.'
const WARNING_TITLE = '⚠️  Warning: PR has conflicts or merge issues'

type MergeableValue = boolean | string | null | undefined

function is_mergeable_conflicting(mergeable: MergeableValue): boolean {
	if (typeof mergeable === 'string') {
		return mergeable === MERGEABLE_CONFLICTING
	}
	return mergeable === false
}

function is_merge_state_blocked(merge_state_status: string | null | undefined): boolean {
	if (merge_state_status === undefined || merge_state_status === null) {
		return false
	}
	const normalized = merge_state_status.toLowerCase()
	return normalized === MERGE_STATE_DIRTY || normalized === MERGE_STATE_BLOCKED
}

function parse_pr_info(pr_info_json: string): Record<string, unknown> | undefined {
	try {
		return JSON.parse(pr_info_json) as Record<string, unknown>
	} catch {
		return undefined
	}
}

function get_pr_properties(pr_info: Record<string, unknown>): {
	is_mergeable: MergeableValue
	merge_state_status: string | null | undefined
} {
	// eslint-disable-next-line dot-notation
	const is_mergeable = (pr_info['mergeable'] as MergeableValue) ?? undefined
	// eslint-disable-next-line dot-notation
	const merge_state_status = (pr_info['mergeStateStatus'] as string | null | undefined) ?? undefined
	return { is_mergeable, merge_state_status }
}

function check_conflict_conditions(
	is_mergeable: MergeableValue,
	merge_state_status: string | null | undefined,
): boolean {
	if (is_mergeable_conflicting(is_mergeable)) {
		return true
	}
	return is_merge_state_blocked(merge_state_status)
}

function has_conflicts(pr_info_json: string): boolean {
	const pr_info = parse_pr_info(pr_info_json)
	if (pr_info === undefined) {
		return false
	}
	const { is_mergeable, merge_state_status } = get_pr_properties(pr_info)
	return check_conflict_conditions(is_mergeable, merge_state_status)
}

function display_conflict_warning(): void {
	console.error('')
	console.error(WARNING_TITLE)
	console.error('')
	console.error(CONFLICT_MESSAGE)
	console.error('Please resolve the conflicts and update the PR.')
	console.error('')
	process.exit(1)
}

async function check_pr_status_for_errors(branch_name: string): Promise<boolean> {
	try {
		const pr_info_json = await git_command.pr_view(branch_name)
		if (pr_info_json.length === 0) {
			return false
		}
		if (has_conflicts(pr_info_json)) {
			display_conflict_warning()
			return true
		}
		return false
	} catch {
		// Ignore errors when checking PR status
		return false
	}
}

function display_success_message(): void {
	console.info('')
	console.info('✅ Status checks completed.')
	console.info('')
	console.info('✅ All checks passed successfully.')
	console.info('')
	console.info('PR is ready for review.')
	console.info('')
}

function display_error_message(): void {
	console.info('')
	console.info('⚠️  PR has conflicts or merge issues.')
	console.info('')
}

async function wait_and_check_status(branch_name: string): Promise<void> {
	await wait_for_seconds(WAIT_AFTER_PR_SECONDS, '⏳ Waiting before checking PR status')

	console.info('')
	console.info('📊 Watching PR status checks...')
	console.info('')

	await git_command.pr_checks_watch(branch_name)

	const has_errors = await check_pr_status_for_errors(branch_name)

	if (has_errors) {
		display_error_message()
	} else {
		display_success_message()
	}
}

async function check_pr_exists(branch_name: string): Promise<boolean> {
	try {
		await exec_async(`gh pr view ${branch_name}`)
		return true
	} catch {
		return false
	}
}

async function create(title: string, body: string, branch_name: string): Promise<void> {
	const has_pr = await check_pr_exists(branch_name)
	if (!has_pr) {
		await create_pr(title, body)
	}
	await wait_and_check_status(branch_name)
}

const git_pr = {
	create,
}

export { git_pr }
