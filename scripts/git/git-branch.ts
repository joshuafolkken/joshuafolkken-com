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

const git_branch = {
	current,
}

export { git_branch }
