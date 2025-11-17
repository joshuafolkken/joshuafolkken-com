import { animation_helpers } from './animation-helpers.js'
import { git_command } from './git-command.js'

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
		async (): Promise<void> => {
			await git_command.checkout_b(branch_name)
		},
		{
			error_message: 'Failed to create branch',
		},
	)
}

async function switch_to(branch_name: string): Promise<void> {
	await animation_helpers.execute_with_animation(
		`Switching to branch: ${branch_name}...`,
		async (): Promise<void> => {
			await git_command.checkout(branch_name)
		},
		{
			error_message: 'Failed to switch branch',
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

const git_branch = {
	current,
	create,
	switch_to,
	exists,
}

export { git_branch }
