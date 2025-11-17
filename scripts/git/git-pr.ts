import { animation_helpers } from './animation-helpers.js'
import { git_command } from './git-command.js'

const WAIT_AFTER_PR_SECONDS = 5
const WAIT_BEFORE_RETRY_SECONDS = 5
const SECONDS_TO_MILLISECONDS = 1000

async function wait_for_seconds(seconds: number): Promise<void> {
	await new Promise((resolve) => {
		setTimeout(resolve, seconds * SECONDS_TO_MILLISECONDS)
	})
}

function is_no_checks_reported(output: string): boolean {
	return output.toLowerCase().includes('no checks reported')
}

function has_pending_checks(output: string): boolean {
	const normalized = output.toLowerCase()
	return /\b(pending|in progress|queued)\b/u.test(normalized)
}

async function check_pr_status(branch_name: string): Promise<string> {
	try {
		return await git_command.pr_checks(branch_name)
	} catch {
		return ''
	}
}

async function wait_for_status_available(branch_name: string): Promise<void> {
	for (;;) {
		const output = await check_pr_status(branch_name)
		if (output.length > 0 && !is_no_checks_reported(output)) {
			return
		}
		await wait_for_seconds(WAIT_BEFORE_RETRY_SECONDS)
	}
}

async function wait_for_checks_complete(branch_name: string): Promise<void> {
	await wait_for_status_available(branch_name)

	for (;;) {
		const output = await check_pr_status(branch_name)
		if (!has_pending_checks(output)) {
			return
		}
		await wait_for_seconds(WAIT_BEFORE_RETRY_SECONDS)
	}
}

async function create_pr(title: string, body: string): Promise<void> {
	await animation_helpers.execute_with_animation(
		'Creating pull request...',
		async () => {
			await git_command.pr_create(title, body)
			return 'PR created.'
		},
		{
			icon_selector: () => '✅',
			error_message: 'Failed to create PR',
			result_formatter: (message) => message,
		},
	)
}

async function wait_and_check_status(branch_name: string): Promise<void> {
	await wait_for_seconds(WAIT_AFTER_PR_SECONDS)

	await animation_helpers.execute_with_animation(
		'Checking PR status...',
		async () => {
			await wait_for_checks_complete(branch_name)
			return 'Status checks completed.'
		},
		{
			icon_selector: () => '✅',
			error_message: 'Failed to check PR status',
			result_formatter: (message) => message,
		},
	)
}

async function create(title: string, body: string, branch_name: string): Promise<void> {
	await create_pr(title, body)
	await wait_and_check_status(branch_name)
}

const git_pr = {
	create,
}

export { git_pr }
