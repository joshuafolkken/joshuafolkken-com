#!/usr/bin/env node
import { git_branch } from './git/git-branch.js'
import { git_error } from './git/git-error.js'
import { git_issue } from './git/git-issue.js'
import { git_prompt } from './git/git-prompt.js'
import { git_status } from './git/git-status.js'

async function execute_workflow_steps(): Promise<void> {
	await git_branch.current()
	await git_issue.get_and_display()
}

async function main(): Promise<void> {
	const has_unstaged = await git_status.check_unstaged()
	if (has_unstaged) {
		await git_prompt.confirm_unstaged_files()
	}
	await execute_workflow_steps()
}

try {
	console.info('')
	await main()
	console.info('')
} catch (error) {
	git_error.handle(error)
}
