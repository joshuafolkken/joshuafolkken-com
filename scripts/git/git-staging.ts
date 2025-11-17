import { git_prompt } from './git-prompt.js'
import { git_status } from './git-status.js'

async function confirm_package_json_staged(): Promise<boolean> {
	const is_package_json_staged = await git_status.check_package_json_staged()
	if (!is_package_json_staged) {
		await git_prompt.confirm_missing_package_json()
		return false
	}
	return true
}

async function confirm_package_json_version(): Promise<void> {
	const is_version_updated = await git_status.check_package_json_version()
	if (!is_version_updated) {
		await git_prompt.confirm_without_version_update()
	}
}

async function check_and_confirm_package_json(): Promise<void> {
	const is_staged = await confirm_package_json_staged()
	if (is_staged) {
		await confirm_package_json_version()
	}
}

async function check_and_confirm_staging(): Promise<void> {
	const has_unstaged = await git_status.check_unstaged()
	if (has_unstaged) {
		await git_prompt.confirm_unstaged_files()
	}
	await check_and_confirm_package_json()
}

const git_staging = {
	check_and_confirm_staging,
}

export { git_staging }
