import { git_prompt } from './git-prompt'
import { git_status } from './git-status'

async function confirm_package_json_staged(force = false): Promise<boolean> {
	const is_package_json_staged = await git_status.check_package_json_staged()

	if (!is_package_json_staged) {
		if (force) {
			console.info('💡 Skipping package.json staging check (force).')

			return false
		}

		await git_prompt.confirm_missing_package_json()

		return false
	}

	return true
}

async function confirm_package_json_version(force = false): Promise<void> {
	const is_version_updated = await git_status.check_package_json_version()

	if (!is_version_updated) {
		if (force) {
			console.info('💡 Skipping package.json version check (force).')

			return
		}

		await git_prompt.confirm_without_version_update()
	}
}

async function check_and_confirm_package_json(force = false): Promise<void> {
	const is_staged = await confirm_package_json_staged(force)

	if (is_staged) {
		await confirm_package_json_version(force)
	}
}

async function check_and_confirm_staging(force = false): Promise<void> {
	const has_unstaged = await git_status.check_unstaged()

	if (has_unstaged) {
		if (force) {
			console.info('💡 Skipping unstaged files check (force).')
		} else {
			await git_prompt.confirm_unstaged_files()
		}
	}

	await check_and_confirm_package_json(force)
}

const git_staging = {
	check_and_confirm_staging,
}

export { git_staging }
