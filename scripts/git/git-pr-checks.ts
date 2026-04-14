import { git_gh_command } from './git-gh-command'

// cspell:words coderabbit

const CHECK_STATUS_PASS = 'pass'
const CHECK_STATUS_PENDING = 'pending'
const CHECK_STATUS_FAIL = 'fail'
const REQUIRED_CHECKS = ['Workers Builds: tasks', 'CodeRabbit', 'SonarQube']
const CHECK_WAIT_INTERVAL_MS = 10_000
const CHECK_MAX_ATTEMPTS = 18

const KEY_TYPE_NAME = '__typename'
const KEY_STATE = 'state'
const KEY_STATUS = 'status'
const KEY_CONCLUSION = 'conclusion'
const KEY_NAME = 'name'
const KEY_CONTEXT = 'context'
const KEY_STATUS_ROLLUP = 'statusCheckRollup'

interface RollupCheck {
	name: string
	status: string
}

function read_string(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined
	const trimmed = value.trim()
	if (trimmed.length === 0) return undefined

	return trimmed
}

function parse_status_context(item: Record<string, unknown>): string {
	const state = read_string(item[KEY_STATE])?.toLowerCase()
	if (state === 'success') return CHECK_STATUS_PASS
	if (state === 'pending') return CHECK_STATUS_PENDING

	return CHECK_STATUS_FAIL
}

function parse_check_run(item: Record<string, unknown>): string {
	const status = read_string(item[KEY_STATUS])?.toLowerCase()
	if (status !== 'completed') return CHECK_STATUS_PENDING
	const conclusion = read_string(item[KEY_CONCLUSION])?.toLowerCase()

	return conclusion === 'success' ? CHECK_STATUS_PASS : CHECK_STATUS_FAIL
}

function parse_rollup_status(item: Record<string, unknown>): string {
	const type_name = read_string(item[KEY_TYPE_NAME])
	if (type_name === 'StatusContext') return parse_status_context(item)

	return parse_check_run(item)
}

function read_rollup_array(parsed: unknown): Array<Record<string, unknown>> {
	if (typeof parsed !== 'object' || parsed === null) return []
	const parsed_record = parsed as Record<string, unknown>
	const rollup = parsed_record[KEY_STATUS_ROLLUP]
	if (!Array.isArray(rollup)) return []

	return rollup.filter((item): item is Record<string, unknown> => {
		return typeof item === 'object' && item !== null
	})
}

function parse_json_safe(raw_json: string): unknown {
	try {
		return JSON.parse(raw_json) as unknown
	} catch {
		return undefined
	}
}

function parse_rollup_item(item: Record<string, unknown>): RollupCheck | undefined {
	const name = read_string(item[KEY_NAME]) ?? read_string(item[KEY_CONTEXT])
	if (name === undefined) return undefined

	return { name, status: parse_rollup_status(item) }
}

function parse_rollup_checks(raw_json: string): Array<RollupCheck> {
	const parsed = parse_json_safe(raw_json)
	const rollup = read_rollup_array(parsed)
	const checks: Array<RollupCheck> = []

	for (const item of rollup) {
		const parsed_item = parse_rollup_item(item)
		if (parsed_item !== undefined) checks.push(parsed_item)
	}

	return checks
}

async function sleep(ms: number): Promise<void> {
	await new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

function has_all_required_checks(checks: ReadonlyArray<RollupCheck>): boolean {
	return REQUIRED_CHECKS.every((name) => checks.some((check) => check.name === name))
}

function has_pending_required_check(checks: ReadonlyArray<RollupCheck>): boolean {
	const required = checks.filter((check) => REQUIRED_CHECKS.includes(check.name))

	return required.some((check) => check.status === CHECK_STATUS_PENDING)
}

function is_checks_settled(checks: ReadonlyArray<RollupCheck>): boolean {
	return !has_pending_required_check(checks) && has_all_required_checks(checks)
}

async function wait_checks_completed(branch_name: string): Promise<Array<RollupCheck>> {
	for (let attempt = 0; attempt < CHECK_MAX_ATTEMPTS; attempt += 1) {
		const rollup_json = await git_gh_command.pr_get_status_rollup(branch_name)
		const checks = parse_rollup_checks(rollup_json)
		if (is_checks_settled(checks)) return checks

		await sleep(CHECK_WAIT_INTERVAL_MS)
	}

	throw new Error('Timed out while waiting for PR checks to complete.')
}

function find_required_check(
	checks: ReadonlyArray<RollupCheck>,
	required_name: string,
): RollupCheck | undefined {
	return checks.find((check) => check.name === required_name)
}

function assert_required_check_status(input: {
	required_name: string
	matched: RollupCheck | undefined
}): void {
	if (input.matched === undefined) throw new Error(`Required check missing: ${input.required_name}`)
	if (input.matched.status === CHECK_STATUS_PASS) return

	throw new Error(`Required check not passed: ${input.required_name} (${input.matched.status})`)
}

function assert_required_checks_passed(checks: ReadonlyArray<RollupCheck>): void {
	for (const required_name of REQUIRED_CHECKS) {
		const matched = find_required_check(checks, required_name)

		assert_required_check_status({ required_name, matched })
	}
}

const git_pr_checks = {
	wait_checks_completed,
	assert_required_checks_passed,
}

export { git_pr_checks }
export type { RollupCheck }
