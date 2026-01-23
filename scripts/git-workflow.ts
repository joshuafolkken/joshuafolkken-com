#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { git_branch } from './git/git-branch'
import { git_commit } from './git/git-commit'
import { git_error } from './git/git-error'
import { git_issue, type IssueInfo } from './git/git-issue'
import { git_pr } from './git/git-pr'
import { git_prompt, type WorkflowConfirmations } from './git/git-prompt'
import { git_push } from './git/git-push'
import { git_staging } from './git/git-staging'

const SKIP_MESSAGES = {
	commit: '💡 Commit skipped.',
	push: '💡 Push skipped.',
	pr: '💡 PR skipped.',
} as const

function display_help(): void {
	console.info(`
🚀 Git Workflow Script

Usage:
  pnpm git [issue] [options]

Arguments:
  issue             Title and issue number (e.g., "feat: add login #42")
                    If provided, the script runs in non-interactive mode.

Options:
  --skip-commit     Skip the commit step.
  --skip-push       Skip the push step.
  --skip-pr         Skip the PR creation step.
  -y, --yes         Skip safety confirmations (unstaged files, etc.).
  -h, --help        Display this help message.

Examples:
  pnpm git "fix: bug #12" --skip-pr
  pnpm git -h
	`)
}

async function execute_commit_step(
	commit_message: string,
	confirmations: WorkflowConfirmations,
): Promise<void> {
	if (confirmations.commit) {
		await git_commit.commit(commit_message)
	} else {
		console.info(SKIP_MESSAGES.commit)
	}
}

async function execute_push_step(confirmations: WorkflowConfirmations): Promise<void> {
	if (confirmations.push) {
		await git_push.push()
	} else {
		console.info(SKIP_MESSAGES.push)
	}
}

async function execute_pr_step(
	issue_info: IssueInfo,
	confirmations: WorkflowConfirmations,
): Promise<void> {
	if (confirmations.pr) {
		await git_pr.create_with_issue_info(issue_info)
	} else {
		console.info(SKIP_MESSAGES.pr)
	}
}

async function run_workflow_steps(
	issue_info: IssueInfo,
	confirmations: WorkflowConfirmations,
): Promise<void> {
	await execute_commit_step(issue_info.commit_message, confirmations)
	await execute_push_step(confirmations)
	await execute_pr_step(issue_info, confirmations)
}

/* eslint-disable @typescript-eslint/naming-convention */
interface CliArguments {
	values: {
		'skip-commit'?: boolean
		'skip-push'?: boolean
		'skip-pr'?: boolean
		yes?: boolean
		help?: boolean
	}
	positionals: Array<string>
}
/* eslint-enable @typescript-eslint/naming-convention */

function parse_cli_arguments(): CliArguments {
	return parseArgs({
		options: {
			'skip-commit': { type: 'boolean' },
			'skip-push': { type: 'boolean' },
			'skip-pr': { type: 'boolean' },
			yes: { type: 'boolean', short: 'y' },
			help: { type: 'boolean', short: 'h' },
		},
		// eslint-disable-next-line @typescript-eslint/naming-convention
		allowPositionals: true,
	})
}

async function get_workflow_confirmations(
	is_auto_mode: boolean,
	values: CliArguments['values'],
): Promise<WorkflowConfirmations> {
	if (is_auto_mode) {
		return {
			commit: values['skip-commit'] !== true,
			push: values['skip-push'] !== true,
			pr: values['skip-pr'] !== true,
		}
	}

	return await git_prompt.confirm_workflow_steps()
}

async function prepare_issue_info(cli_issue_input?: string): Promise<IssueInfo> {
	const current_branch = await git_branch.current()
	const issue_info = await git_issue.get_and_display(cli_issue_input)

	await git_branch.check_and_create_branch(current_branch, issue_info.branch_name)

	return issue_info
}

async function main(): Promise<void> {
	const { values, positionals } = parse_cli_arguments()

	if (values.help === true) {
		display_help()

		return
	}

	const [cli_issue_input] = positionals
	const is_auto_mode = cli_issue_input !== undefined

	await git_staging.check_and_confirm_staging(values.yes === true)

	const issue_info = await prepare_issue_info(cli_issue_input)
	const confirmations = await get_workflow_confirmations(is_auto_mode, values)

	await run_workflow_steps(issue_info, confirmations)
}

try {
	await main()
	console.info('')
} catch (error) {
	git_error.handle(error)
}
