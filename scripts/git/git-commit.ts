import { animation_helpers, type AnimationOptions } from './animation-helpers.js'
import { git_command } from './git-command.js'

async function commit(commit_message: string): Promise<void> {
	const config: AnimationOptions<string> = {
		icon_selector: () => '✅',
		error_message: 'Failed to commit changes',
		result_formatter: (message) => message,
	}
	await animation_helpers.execute_with_animation(
		'Committing staged changes...',
		async () => {
			await git_command.commit(commit_message)
			return 'Commit completed.'
		},
		config,
	)
}

const git_commit = {
	commit,
}

export { git_commit }
