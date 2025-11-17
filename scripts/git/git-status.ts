import { animation_helpers } from './animation-helpers.js'
import { REQUIRED_STATUS_LENGTH, STAGED_STATUS_INDEX, UNTRACKED_FILE_PREFIX } from './constants.js'
import { git_command } from './git-command.js'

const WARNING_ICON = '🔔'
const PACKAGE_JSON_FILE = 'package.json'
const STATUS_PREFIX_LENGTH = 2

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

function parse_status_lines(status_output: string): Array<string> {
	return status_output
		.split(/\r?\n/u)
		.map((line) => line.trimEnd())
		.filter((line) => line.length > 0)
}

function is_staged_file(line: string): boolean {
	if (line.length < REQUIRED_STATUS_LENGTH) {
		return false
	}
	if (is_untracked_file(line)) {
		return false
	}
	const [staged_status] = line
	return staged_status !== ' '
}

function has_unstaged_changes(line: string): boolean {
	return line.length >= REQUIRED_STATUS_LENGTH && line[STAGED_STATUS_INDEX] !== ' '
}

function has_all_files_staged(status_output: string): boolean {
	const lines = parse_status_lines(status_output)
	if (lines.length === 0) {
		return true
	}
	return lines.every((line) => !has_unstaged_changes(line))
}

function extract_filename(line: string): string {
	return line.slice(STATUS_PREFIX_LENGTH).trim()
}

function is_package_json_staged(status_output: string): boolean {
	const lines = parse_status_lines(status_output)
	return lines.some((line) => {
		if (!is_staged_file(line)) {
			return false
		}
		const filename = extract_filename(line)
		return filename === PACKAGE_JSON_FILE
	})
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

async function check_all_staged(): Promise<boolean> {
	return await animation_helpers.execute_with_animation(
		'Checking if all files are staged...',
		async () => {
			const status_output = await git_command.status()
			return has_all_files_staged(status_output)
		},
		{
			icon_selector: (all_staged) => (all_staged ? undefined : WARNING_ICON),
			error_message: 'Failed to check staged files',
			result_formatter: (all_staged) => (all_staged ? 'All staged' : 'Not all staged'),
		},
	)
}

async function check_package_json_staged(): Promise<boolean> {
	return await animation_helpers.execute_with_animation(
		'Checking if package.json is staged...',
		async () => {
			const status_output = await git_command.status()
			return is_package_json_staged(status_output)
		},
		{
			icon_selector: (is_staged) => (is_staged ? undefined : WARNING_ICON),
			error_message: 'Failed to check package.json staging status',
			result_formatter: (is_staged) => (is_staged ? 'Staged' : 'Not staged'),
		},
	)
}

function is_version_updated_in_diff(diff_output: string): boolean {
	const version_pattern = /^[+-].*"version"\s*:/u
	return diff_output.split(/\r?\n/u).some((line) => version_pattern.test(line))
}

async function check_package_json_version(): Promise<boolean> {
	return await animation_helpers.execute_with_animation(
		'Checking if package.json version is updated...',
		async () => {
			const diff_output: string = await git_command.diff_cached(PACKAGE_JSON_FILE)
			return is_version_updated_in_diff(diff_output)
		},
		{
			icon_selector: (is_updated) => (is_updated ? undefined : WARNING_ICON),
			error_message: 'Failed to check package.json version update',
			result_formatter: (is_updated) => (is_updated ? 'Updated' : 'Not updated'),
		},
	)
}

const git_status = {
	check_unstaged,
	check_all_staged,
	check_package_json_staged,
	check_package_json_version,
}

export { git_status }
