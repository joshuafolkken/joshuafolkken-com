import { animation_helpers } from './animation-helpers.js'
import { REQUIRED_STATUS_LENGTH, STAGED_STATUS_INDEX, UNTRACKED_FILE_PREFIX } from './constants.js'
import { git_command } from './git-command.js'

const WARNING_ICON = '🔔'

function is_untracked_file(line: string): boolean {
	return line.startsWith(UNTRACKED_FILE_PREFIX)
}

function is_unstaged_file(line: string): boolean {
	return line.length >= REQUIRED_STATUS_LENGTH && line[STAGED_STATUS_INDEX] !== ' '
}

function has_unstaged_files(status_output: string): boolean {
	const lines = status_output
		.split(/\r?\n/u)
		.map((line) => line.trimEnd())
		.filter((line) => line.length > 0)

	const has_untracked = lines.some((line) => is_untracked_file(line))
	const has_unstaged = lines.some((line) => is_unstaged_file(line))

	return has_untracked || has_unstaged
}

async function check_unstaged(): Promise<boolean> {
	return await animation_helpers.execute_with_animation(
		'Checking unstaged files...',
		async () => {
			const status_output = await git_command.status()
			return has_unstaged_files(status_output)
		},
		{
			icon_selector: (has_unstaged) => (has_unstaged ? WARNING_ICON : undefined),
			error_message: 'Failed to check unstaged files',
			result_formatter: (has_unstaged) => (has_unstaged ? 'Found' : 'None'),
		},
	)
}

const git_status = {
	check_unstaged,
}

export { git_status }
