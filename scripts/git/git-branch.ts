import { animation_helpers } from './animation-helpers.js'
import { git_command } from './git-command.js'
import { git_error } from './git-error.js'

async function current(): Promise<string> {
	return await animation_helpers.execute_with_animation(
		'Getting current branch...',
		git_command.branch,
		{
			error_message: 'Failed to get current branch',
		},
	)
}

async function create(branch_name: string): Promise<void> {
	await animation_helpers.execute_with_animation(
		`Creating branch: ${branch_name}...`,
		async () => {
			await git_command.checkout_b(branch_name)
			return `Branch created: ${branch_name}`
		},
		{
			error_message: 'Failed to create branch',
			icon_selector: () => '✅',
			result_formatter: (message) => message,
		},
	)
}

async function switch_to(branch_name: string): Promise<void> {
	await animation_helpers.execute_with_animation(
		`Switching to branch: ${branch_name}...`,
		async () => {
			await git_command.checkout(branch_name)
			return `Switched to branch: ${branch_name}`
		},
		{
			error_message: 'Failed to switch branch',
			icon_selector: () => '✅',
			result_formatter: (message) => message,
		},
	)
}

async function exists(branch_name: string): Promise<boolean> {
	return await animation_helpers.execute_with_animation(
		'Checking if branch exists...',
		async () => {
			return await git_command.branch_exists(branch_name)
		},
		{
			error_message: 'Failed to check branch existence',
			result_formatter: (is_exists: boolean) => (is_exists ? 'Exists' : 'Not found'),
		},
	)
}

async function handle_main_branch(target_branch_name: string): Promise<void> {
	const is_branch_exists: boolean = await exists(target_branch_name)
	await (is_branch_exists ? switch_to(target_branch_name) : create(target_branch_name))
}

async function check_and_create_branch(
	current_branch: string,
	target_branch_name: string,
): Promise<void> {
	if (current_branch === 'main') {
		await handle_main_branch(target_branch_name)
		return
	}

	if (current_branch !== target_branch_name) {
		git_error.display_branch_mismatch_error(current_branch, target_branch_name)
	}
}

const git_branch = {
	current,
	create,
	switch_to,
	exists,
	check_and_create_branch,
}

export { git_branch }
