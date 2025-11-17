import { animation_helpers } from './animation-helpers.js'
import { git_command } from './git-command.js'

async function commit(commit_message: string): Promise<void> {
	await animation_helpers.execute_with_animation(
		'Committing staged changes...',
		async () => {
			await git_command.commit(commit_message)
			return 'Commit completed.'
		},
		{
			icon_selector: () => '✅',
			error_message: 'Failed to commit changes',
			result_formatter: (message) => message,
		},
	)
}

const git_commit = {
	commit,
}

export { git_commit }
