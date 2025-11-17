import { animation_helpers } from './animation-helpers.js'
import { git_command } from './git-command.js'

async function push(): Promise<void> {
	await animation_helpers.execute_with_animation(
		'Pushing changes to remote...',
		async () => {
			await git_command.push()
			return 'Push completed.'
		},
		{
			icon_selector: () => '✅',
			error_message: 'Failed to push changes',
			result_formatter: (message) => message,
		},
	)
}

const git_push = {
	push,
}

export { git_push }
