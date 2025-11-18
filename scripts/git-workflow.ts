#!/usr/bin/env node
import { git_branch } from './git/git-branch.js'
import { git_commit } from './git/git-commit.js'
import { git_error } from './git/git-error.js'
import { git_issue, type IssueInfo } from './git/git-issue.js'
import { git_pr } from './git/git-pr.js'
import { git_prompt } from './git/git-prompt.js'
import { git_push } from './git/git-push.js'
import { git_staging } from './git/git-staging.js'

const SKIP_MESSAGES = {
	commit: '💡 Commit skipped.',
	push: '💡 Push skipped.',
	pr: '💡 PR skipped.',
} as const

type ConfirmAction = () => Promise<boolean>
type WorkflowAction = () => Promise<void>

async function execute_with_confirmation(
	confirm_action: ConfirmAction,
	skip_message: string,
	action: WorkflowAction,
): Promise<void> {
	const should_execute = await confirm_action()
	if (!should_execute) {
		console.info(skip_message)
		return
	}
	await action()
}

async function commit_changes(commit_message: string): Promise<void> {
	await execute_with_confirmation(git_prompt.confirm_commit, SKIP_MESSAGES.commit, async () => {
		await git_commit.commit(commit_message)
	})
}

async function push_changes(): Promise<void> {
	await execute_with_confirmation(git_prompt.confirm_push, SKIP_MESSAGES.push, async () => {
		await git_push.push()
	})
}

async function create_pr(issue_info: IssueInfo): Promise<void> {
	await execute_with_confirmation(git_prompt.confirm_pr, SKIP_MESSAGES.pr, async () => {
		await git_pr.create_with_issue_info(issue_info)
	})
}

async function execute_workflow_steps(): Promise<void> {
	const current_branch: string = await git_branch.current()
	const issue_info: IssueInfo = await git_issue.get_and_display()
	await git_branch.check_and_create_branch(current_branch, issue_info.branch_name)
	await commit_changes(issue_info.commit_message)
	await push_changes()
	await create_pr(issue_info)
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
