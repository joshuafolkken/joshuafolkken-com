#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { platform } from 'node:os'

interface CheckResult {
	success: boolean
	message: string
}

function get_git_command(): string {
	if (platform() === 'win32') {
		return String.raw`"C:\Program Files\Git\bin\git.exe"`
	}
	return '/usr/bin/git'
}

function get_current_branch(): string {
	try {
		const git_command = get_git_command()
		return execSync(`${git_command} rev-parse --abbrev-ref HEAD`, { encoding: 'utf8' }).trim() // eslint-disable-line sonarjs/os-command
	} catch (error) {
		throw new Error('Failed to get current branch', { cause: error })
	}
}

function execute_check(check_function: () => CheckResult): void {
	const result = check_function()
	console.log(result.message) // eslint-disable-line no-console

	if (!result.success) {
		process.exit(1)
	}
}

export type { CheckResult }
export { get_current_branch, execute_check }
