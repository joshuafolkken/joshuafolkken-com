import { EOL } from 'node:os'
import type { CommandOptions, CommandResult } from './command-types.js'
import { AutomationError } from './error-utilities.js'

type RunCommand = (
	command: string,
	arguments_list: Array<string>,
	options?: CommandOptions,
) => CommandResult

interface GitHelpers {
	ensure_staging_state: () => void
	get_staged_files: () => Array<string>
	ensure_main_is_updated: (branch: string) => void
	create_branch: (branch: string) => void
	get_current_branch: () => string
}

const STAGED_STATUS_INDEX = 1
const REQUIRED_STATUS_LENGTH = 2

function ensure_staging_state_with(run_command: RunCommand): void {
	const { stdout } = run_command('git', ['status', '--porcelain'], {
		description: 'Check staging status',
	})

	const lines = stdout
		.split(/\r?\n/u)
		.map((line) => line.trimEnd())
		.filter((line) => line.length > 0)

	const has_untracked = lines.some((line) => line.startsWith('??'))
	const has_unstaged = lines.some(
		(line) => line.length >= REQUIRED_STATUS_LENGTH && line[STAGED_STATUS_INDEX] !== ' ',
	)

	if (has_untracked || has_unstaged) {
		throw new AutomationError(
			[
				'🚫 Not all changes are staged.',
				'Stage your changes with:',
				'  git add .',
				'Rerun this script after staging.',
			].join(EOL),
		)
	}
}

function get_staged_files_with(run_command: RunCommand): Array<string> {
	const { stdout } = run_command('git', ['diff', '--cached', '--name-only'], {
		description: 'Get staged files',
	})
	return stdout
		.split(/\r?\n/u)
		.map((line) => line.trim())
		.filter((line) => line.length > 0)
}

function ensure_main_is_updated_with(run_command: RunCommand, branch: string): void {
	const target = branch === 'master' ? 'master' : 'main'
	run_command('git', ['pull', 'origin', target], {
		stdio: 'inherit',
		description: `Pull latest ${target} branch`,
	})
}

function create_branch_with(run_command: RunCommand, branch: string): void {
	run_command('git', ['checkout', '-b', branch], {
		stdio: 'inherit',
		description: `Create branch ${branch}`,
	})
}

function get_current_branch_with(run_command: RunCommand): string {
	const { stdout } = run_command('git', ['branch', '--show-current'], {
		description: 'Get current branch',
	})
	return stdout.trim()
}

function create_git_helpers(run_command: RunCommand): GitHelpers {
	return {
		ensure_staging_state: () => {
			ensure_staging_state_with(run_command)
		},
		get_staged_files: () => get_staged_files_with(run_command),
		ensure_main_is_updated: (branch) => {
			ensure_main_is_updated_with(run_command, branch)
		},
		create_branch: (branch) => {
			create_branch_with(run_command, branch)
		},
		get_current_branch: () => get_current_branch_with(run_command),
	}
}

export { create_git_helpers }
