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

const git_branch = {
	current,
	create,
}

export { git_branch }
