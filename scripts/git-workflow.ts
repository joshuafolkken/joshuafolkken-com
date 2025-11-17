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

async function check_package_json_staged(): Promise<boolean> {
	const is_package_json_staged: boolean = await git_status.check_package_json_staged()
	if (!is_package_json_staged) {
		await git_prompt.confirm_missing_package_json()
		return false
	}
	return true
}

async function check_package_json_version(): Promise<void> {
	const is_version_updated: boolean = await git_status.check_package_json_version()
	if (!is_version_updated) {
		await git_prompt.confirm_without_version_update()
	}
}

async function check_package_json_staging(): Promise<void> {
	const is_staged = await check_package_json_staged()
	if (is_staged) {
		await check_package_json_version()
	}
}

async function check_and_confirm_staging(): Promise<void> {
	const has_unstaged = await git_status.check_unstaged()
	if (has_unstaged) {
		await git_prompt.confirm_unstaged_files()
	}
	await check_package_json_staging()
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
