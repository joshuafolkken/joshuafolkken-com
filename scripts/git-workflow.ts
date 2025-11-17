#!/usr/bin/env node
import { git_branch } from './git/git-branch.js'
import { git_commit } from './git/git-commit.js'
import { git_error } from './git/git-error.js'
import { git_issue, type IssueInfo } from './git/git-issue.js'
import { git_prompt } from './git/git-prompt.js'
import { git_push } from './git/git-push.js'
import { git_staging } from './git/git-staging.js'

async function execute_with_confirmation(
	confirm_action: () => Promise<boolean>,
	skip_message: string,
	action: () => Promise<void>,
): Promise<void> {
	const should_execute = await confirm_action()
	if (!should_execute) {
		console.info(skip_message)
		return
	}
	await action()
}

async function commit_changes(commit_message: string): Promise<void> {
	await execute_with_confirmation(git_prompt.confirm_commit, '💡 Commit skipped.', async () => {
		await git_commit.commit(commit_message)
	})
}

async function push_changes(): Promise<void> {
	await execute_with_confirmation(git_prompt.confirm_push, '💡 Push skipped.', async () => {
		await git_push.push()
	})
}

async function execute_workflow_steps(): Promise<void> {
	const current_branch: string = await git_branch.current()
	const issue_info: IssueInfo = await git_issue.get_and_display()
	await git_branch.check_and_create_branch(current_branch, issue_info.branch_name)
	await commit_changes(issue_info.commit_message)
	await push_changes()
}

async function main(): Promise<void> {
	await git_staging.check_and_confirm_staging()
	await execute_workflow_steps()
}

try {
	await main()
	console.info('')
} catch (error) {
	git_error.handle(error)
}
