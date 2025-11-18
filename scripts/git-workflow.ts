#!/usr/bin/env node
import { git_branch } from './git/git-branch.js'
import { git_commit } from './git/git-commit.js'
import { git_error } from './git/git-error.js'
import { git_issue, type IssueInfo } from './git/git-issue.js'
import { git_pr } from './git/git-pr.js'
import { git_prompt } from './git/git-prompt.js'
import { git_push } from './git/git-push.js'
import { git_staging } from './git/git-staging.js'

const SKIP_MESSAGE_COMMIT = '💡 Commit skipped.'
const SKIP_MESSAGE_PUSH = '💡 Push skipped.'
const SKIP_MESSAGE_PR = '💡 PR skipped.'

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

function build_pr_title(issue_info: IssueInfo): string {
	return `${issue_info.title} #${issue_info.number}`
}

function build_pr_body(issue_info: IssueInfo): string {
	return `closes #${issue_info.number}`
}

async function commit_changes(commit_message: string): Promise<void> {
	await execute_with_confirmation(git_prompt.confirm_commit, SKIP_MESSAGE_COMMIT, async () => {
		await git_commit.commit(commit_message)
	})
}

async function push_changes(): Promise<void> {
	await execute_with_confirmation(git_prompt.confirm_push, SKIP_MESSAGE_PUSH, async () => {
		await git_push.push()
	})
}

async function create_pr(issue_info: IssueInfo): Promise<void> {
	const title = build_pr_title(issue_info)
	const body = build_pr_body(issue_info)
	await execute_with_confirmation(git_prompt.confirm_pr, SKIP_MESSAGE_PR, async () => {
		await git_pr.create(title, body, issue_info.branch_name)
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
