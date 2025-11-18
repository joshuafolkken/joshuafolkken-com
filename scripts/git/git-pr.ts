import { animation_helpers, type AnimationOptions } from './animation-helpers.js'
import { git_conflict } from './git-conflict.js'
import { git_countdown } from './git-countdown.js'
import { git_gh_command } from './git-gh-command.js'

const WAIT_AFTER_PR_SECONDS = 5

function is_pr_already_exists_message(message: string): boolean {
	return message === 'PR_ALREADY_EXISTS'
}

function check_error_cause(error: Error): boolean {
	return error.cause instanceof Error && is_pr_already_exists_message(error.cause.message)
}

function is_pr_already_exists_error(error: unknown): boolean {
	if (error instanceof Error) {
		if (is_pr_already_exists_message(error.message)) {
			return true
		}
		return check_error_cause(error)
	}
	return false
}

async function create_pr(title: string, body: string): Promise<void> {
	const config: AnimationOptions<string> = {
		icon_selector: () => '✅',
		error_message: 'Failed to create PR',
		result_formatter: (message) => message,
	}
	try {
		await animation_helpers.execute_with_animation(
			'Creating pull request...',
			async () => {
				await git_gh_command.pr_create(title, body)
				return 'PR created.'
			},
			config,
		)
	} catch (error) {
		if (is_pr_already_exists_error(error)) {
			console.info('')
			console.info('ℹ️  Pull request already exists.')
			console.info('')
			return
		}
		throw error
	}
}

function display_success_message(): void {
	console.info('')
	console.info('✅ Status checks completed.')
	console.info('')
	console.info('✅ All checks passed successfully.')
	console.info('')
	console.info('PR is ready for review.')
	console.info('')
}

function display_error_message(): void {
	console.info('')
	console.info('⚠️  PR has conflicts or merge issues.')
	console.info('')
}

async function wait_and_check_status(branch_name: string): Promise<void> {
	await git_countdown.wait_for_seconds(
		WAIT_AFTER_PR_SECONDS,
		'⏳ Waiting before checking PR status',
	)

	console.info('')
	console.info('📊 Watching PR status checks...')
	console.info('')

	await git_gh_command.pr_checks_watch(branch_name)

	const has_errors = await git_conflict.check_pr_status_for_errors(branch_name)

	if (has_errors) {
		display_error_message()
	} else {
		display_success_message()
	}
}

async function create(title: string, body: string, branch_name: string): Promise<void> {
	const has_pr = await git_gh_command.pr_exists(branch_name)
	if (!has_pr) {
		await create_pr(title, body)
	}
	await wait_and_check_status(branch_name)
}

const git_pr = {
	create,
}

export { git_pr }
