import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { animation_helpers } from './animation-helpers.js'
import { git_command } from './git-command.js'

const exec_async = promisify(exec)

const WAIT_AFTER_PR_SECONDS = 5
const WAIT_BEFORE_RETRY_SECONDS = 5
const SECONDS_TO_MILLISECONDS = 1000
const COUNTDOWN_INTERVAL_MS = 1000
const COUNTDOWN_PADDING = 20

function clear_countdown_line(message_length: number): void {
	const clear_length = message_length + COUNTDOWN_PADDING
	process.stdout.write(`\r${' '.repeat(clear_length)}\r`)
}

function update_countdown_display(message: string, remaining: number): void {
	process.stdout.write(`\r${message} (${String(remaining)}s)`)
}

function create_countdown_interval(message: string, total_seconds: number): NodeJS.Timeout {
	let remaining_seconds = total_seconds
	update_countdown_display(message, remaining_seconds)

	return setInterval(() => {
		remaining_seconds -= 1
		if (remaining_seconds > 0) {
			update_countdown_display(message, remaining_seconds)
		} else {
			clear_countdown_line(message.length)
		}
	}, COUNTDOWN_INTERVAL_MS)
}

async function wait_for_seconds(seconds: number, countdown_message?: string): Promise<void> {
	if (countdown_message === undefined || !process.stdout.isTTY) {
		await new Promise((resolve) => {
			setTimeout(resolve, seconds * SECONDS_TO_MILLISECONDS)
		})
		return
	}

	const interval_id = create_countdown_interval(countdown_message, seconds)

	await new Promise((resolve) => {
		setTimeout(resolve, seconds * SECONDS_TO_MILLISECONDS)
	})

	clearInterval(interval_id)
	clear_countdown_line(countdown_message.length)
}

function is_no_checks_reported(output: string): boolean {
	return output.toLowerCase().includes('no checks reported')
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
		await wait_for_seconds(
			WAIT_BEFORE_RETRY_SECONDS,
			'⏳ Waiting for status checks to become available',
		)
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

const MERGE_STATE_DIRTY = 'dirty'
const MERGE_STATE_BLOCKED = 'blocked'
const PR_STATE_CLOSED = 'closed'
const PR_STATE_DRAFT = 'draft'
const CONFLICT_MESSAGE = 'This branch has conflicts that must be resolved.'
const WARNING_TITLE = '⚠️  Warning: PR has conflicts or merge issues'

function is_mergeable_false(mergeable: boolean | null | undefined): boolean {
	return mergeable === false
}

function is_merge_state_blocked(merge_state_status: string | null | undefined): boolean {
	return merge_state_status === MERGE_STATE_DIRTY || merge_state_status === MERGE_STATE_BLOCKED
}

function is_pr_state_invalid(state: string | null | undefined): boolean {
	return state === PR_STATE_CLOSED || state === PR_STATE_DRAFT
}

function parse_pr_info(pr_info_json: string): Record<string, unknown> | undefined {
	try {
		return JSON.parse(pr_info_json) as Record<string, unknown>
	} catch {
		return undefined
	}
}

function get_pr_properties(pr_info: Record<string, unknown>): {
	is_mergeable: boolean | null | undefined
	merge_state_status: string | null | undefined
	state: string | null | undefined
} {
	// eslint-disable-next-line dot-notation
	const is_mergeable = (pr_info['mergeable'] as boolean | null | undefined) ?? undefined
	// eslint-disable-next-line dot-notation
	const merge_state_status = (pr_info['mergeStateStatus'] as string | null | undefined) ?? undefined
	// eslint-disable-next-line dot-notation
	const state = (pr_info['state'] as string | null | undefined) ?? undefined
	return { is_mergeable, merge_state_status, state }
}

function check_conflict_conditions(
	is_mergeable: boolean | null | undefined,
	merge_state_status: string | null | undefined,
	state: string | null | undefined,
): boolean {
	if (is_mergeable_false(is_mergeable)) {
		return true
	}
	if (is_merge_state_blocked(merge_state_status)) {
		return true
	}
	return !is_pr_state_invalid(state)
}

function has_conflicts(pr_info_json: string): boolean {
	const pr_info = parse_pr_info(pr_info_json)
	if (pr_info === undefined) {
		return false
	}
	const { is_mergeable, merge_state_status, state } = get_pr_properties(pr_info)
	return check_conflict_conditions(is_mergeable, merge_state_status, state)
}

function display_conflict_warning(): void {
	console.error('')
	console.error(WARNING_TITLE)
	console.error('')
	console.error(CONFLICT_MESSAGE)
	console.error('Please resolve the conflicts and update the PR.')
	console.error('')
	process.exit(1)
}

async function check_pr_status_for_errors(branch_name: string): Promise<void> {
	try {
		const pr_info_json = await git_command.pr_view(branch_name)
		if (pr_info_json.length === 0) {
			return
		}
		if (has_conflicts(pr_info_json)) {
			display_conflict_warning()
		}
	} catch {
		// Ignore errors when checking PR status
	}
}

async function wait_and_check_status(branch_name: string): Promise<void> {
	await wait_for_seconds(WAIT_AFTER_PR_SECONDS, '⏳ Waiting before checking PR status')

	await wait_for_status_available(branch_name)

	console.info('')
	console.info('📊 Watching PR status checks...')
	console.info('')

	await git_command.pr_checks_watch(branch_name)

	await check_pr_status_for_errors(branch_name)

	console.info('')
	console.info('✅ Status checks completed.')
	console.info('')
}

async function check_pr_exists(branch_name: string): Promise<boolean> {
	try {
		await exec_async(`gh pr view ${branch_name}`)
		return true
	} catch {
		return false
	}
}

async function create(title: string, body: string, branch_name: string): Promise<void> {
	const has_pr = await check_pr_exists(branch_name)
	if (!has_pr) {
		await create_pr(title, body)
	}
	await wait_and_check_status(branch_name)
}

const git_pr = {
	create,
}

export { git_pr }
