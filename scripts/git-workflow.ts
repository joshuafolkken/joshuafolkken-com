#!/usr/bin/env node
import { animation_helpers } from './git/animation-helpers.js'
import { git_branch } from './git/git-branch.js'
import { git_command } from './git/git-command.js'
import { git_error } from './git/git-error.js'
import { git_issue, type IssueInfo } from './git/git-issue.js'
import { git_prompt } from './git/git-prompt.js'
import { git_status } from './git/git-status.js'

function display_branch_mismatch_error(current_branch: string, target_branch_name: string): void {
	console.error('')
	console.error('❌ Branch mismatch detected')
	console.error('')
	console.error(`Current branch: ${current_branch}`)
	console.error(`Expected branch: ${target_branch_name}`)
	console.error('')
	console.error('💡 Please update main branch to the latest and try again.')
	console.error('')
	process.exit(1)
}

async function handle_main_branch(target_branch_name: string): Promise<void> {
	const is_branch_exists: boolean = await git_branch.exists(target_branch_name)
	await (is_branch_exists
		? git_branch.switch_to(target_branch_name)
		: git_branch.create(target_branch_name))
}

async function check_and_create_branch(
	current_branch: string,
	target_branch_name: string,
): Promise<void> {
	if (current_branch === 'main') {
		await handle_main_branch(target_branch_name)
		return
	}

	if (current_branch !== target_branch_name) {
		display_branch_mismatch_error(current_branch, target_branch_name)
	}
}

async function commit_changes(commit_message: string): Promise<void> {
	const should_commit = await git_prompt.confirm_commit()
	if (!should_commit) {
		console.info('💡 Commit skipped.')
		console.info('')
		return
	}
	await animation_helpers.execute_with_animation(
		'Committing staged changes...',
		async () => {
			await git_command.commit(commit_message)
			return 'Commit completed.'
		},
		{
			icon_selector: () => '✅',
			error_message: 'Failed to commit changes',
			result_formatter: (message) => message,
		},
	)
}

async function execute_workflow_steps(): Promise<void> {
	const current_branch: string = await git_branch.current()
	const issue_info: IssueInfo = await git_issue.get_and_display()
	await check_and_create_branch(current_branch, issue_info.branch_name)
	await commit_changes(issue_info.commit_message)
}

async function confirm_package_json_staged(): Promise<boolean> {
	const is_package_json_staged: boolean = await git_status.check_package_json_staged()
	if (!is_package_json_staged) {
		await git_prompt.confirm_missing_package_json()
		return false
	}
	return true
}

async function confirm_package_json_version(): Promise<void> {
	const is_version_updated: boolean = await git_status.check_package_json_version()
	if (!is_version_updated) {
		await git_prompt.confirm_without_version_update()
	}
}

async function check_and_confirm_package_json(): Promise<void> {
	const is_staged = await confirm_package_json_staged()
	if (is_staged) {
		await confirm_package_json_version()
	}
}

async function check_and_confirm_staging(): Promise<void> {
	const has_unstaged = await git_status.check_unstaged()
	if (has_unstaged) {
		await git_prompt.confirm_unstaged_files()
	}
	await check_and_confirm_package_json()
}

async function main(): Promise<void> {
	await check_and_confirm_staging()
	await execute_workflow_steps()
}

try {
	console.info('')
	await main()
	console.info('')
} catch (error) {
	git_error.handle(error)
}
