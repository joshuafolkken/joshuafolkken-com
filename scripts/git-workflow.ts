#!/usr/bin/env node
import { git_branch } from './git/git-branch.js'
import { git_commit } from './git/git-commit.js'
import { git_error } from './git/git-error.js'
import { git_issue, type IssueInfo } from './git/git-issue.js'
import { git_pr } from './git/git-pr.js'
import { git_prompt, type WorkflowConfirmations } from './git/git-prompt.js'
import { git_push } from './git/git-push.js'
import { git_staging } from './git/git-staging.js'

const SKIP_MESSAGES = {
	commit: '💡 Commit skipped.',
	push: '💡 Push skipped.',
	pr: '💡 PR skipped.',
} as const

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

async function execute_workflow_steps(): Promise<void> {
	const current_branch: string = await git_branch.current()
	const issue_info: IssueInfo = await git_issue.get_and_display()
	await git_branch.check_and_create_branch(current_branch, issue_info.branch_name)

	const confirmations: WorkflowConfirmations = await git_prompt.confirm_workflow_steps()

	await execute_commit_step(issue_info.commit_message, confirmations)
	await execute_push_step(confirmations)
	await execute_pr_step(issue_info, confirmations)
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
