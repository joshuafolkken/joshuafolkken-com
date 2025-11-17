import { platform } from 'node:os'

const REQUIRED_STATUS_LENGTH = 2
const STAGED_STATUS_INDEX = 1
const UNTRACKED_FILE_PREFIX = '??'
const SEPARATOR_LINE = '────────────────────────────────────────'

function get_git_command(): string {
	if (platform() === 'win32') {
		return String.raw`"C:\Program Files\Git\bin\git.exe"`
	}
	return '/usr/bin/git'
}

const git_utilities = {
	get_git_command,
}

export {
	REQUIRED_STATUS_LENGTH,
	STAGED_STATUS_INDEX,
	UNTRACKED_FILE_PREFIX,
	SEPARATOR_LINE,
	git_utilities,
}
