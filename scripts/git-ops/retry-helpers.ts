import { error_utilities } from './error-utilities.js'

type Awaitable<T> = T | Promise<T>

interface RetryContext {
	attempt: number
	max_attempts: number
}

interface RetryDetails {
	message: string
	raw_output?: string
}

type RetryStepResult<T> =
	| { status: 'success'; value: T; details?: RetryDetails }
	| { status: 'retry'; details?: RetryDetails }

interface RetryConfig<T> {
	label: string
	execute: (context: RetryContext) => Awaitable<RetryStepResult<T>>
	max_attempts?: number
	retry_delay_ms?: number
}

const DEFAULT_MAX_ATTEMPTS = 5
const DEFAULT_RETRY_DELAY_MS = 5000

async function wait_for(milliseconds: number): Promise<void> {
	await new Promise((resolve) => {
		setTimeout(resolve, milliseconds)
	})
}

function format_attempt_label(prefix: string, attempt: number, max_attempts: number): string {
	return `${prefix} ${String(attempt)}/${String(max_attempts)}`
}

function log_attempt_start(label: string): void {
	console.info(`⏳ ${label}`)
}

function log_attempt_success(label: string): void {
	console.info(`✅ ${label}`)
}

function log_attempt_failure(label: string): void {
	console.info(`❌ ${label}`)
}

function extract_retry_message(details?: RetryDetails): string | undefined {
	if (details === undefined) {
		return undefined
	}

	if (details.message.trim() === '') {
		return details.raw_output
	}

	return details.message
}

function should_attempt_retry(context: RetryContext): boolean {
	return context.attempt < context.max_attempts
}

async function execute_retry_step<T>(
	config: RetryConfig<T>,
	context: RetryContext,
	attempt_label: string,
): Promise<RetryStepResult<T>> {
	try {
		return await config.execute(context)
	} catch (error) {
		log_attempt_failure(attempt_label)
		throw error
	}
}

interface RetryAttemptSuccess<T> {
	type: 'success'
	value: T
}
interface RetryAttemptRetry {
	type: 'retry'
	retry_details: string | undefined
}
type RetryAttemptOutcome<T> = RetryAttemptSuccess<T> | RetryAttemptRetry

async function process_retry_attempt<T>(
	config: RetryConfig<T>,
	context: RetryContext,
	attempt_label: string,
	last_retry_details: string | undefined,
): Promise<RetryAttemptOutcome<T>> {
	const execution_result = await execute_retry_step(config, context, attempt_label)

	if (execution_result.status === 'success') {
		log_attempt_success(attempt_label)
		return { type: 'success', value: execution_result.value }
	}

	const next_retry_details = extract_retry_message(execution_result.details) ?? last_retry_details

	if (!should_attempt_retry(context)) {
		log_attempt_failure(attempt_label)
		throw error_utilities.build_retry_failure_error(`${config.label} failed.`, next_retry_details)
	}

	await wait_for(config.retry_delay_ms ?? DEFAULT_RETRY_DELAY_MS)

	return { type: 'retry', retry_details: next_retry_details }
}

async function retry_with_status<T>(config: RetryConfig<T>): Promise<T> {
	const max_attempts = config.max_attempts ?? DEFAULT_MAX_ATTEMPTS
	let last_retry_details: string | undefined = undefined

	for (let attempt = 1; attempt <= max_attempts; attempt += 1) {
		const context: RetryContext = { attempt, max_attempts }
		const attempt_label = format_attempt_label(config.label, attempt, max_attempts)
		log_attempt_start(attempt_label)

		const outcome: RetryAttemptOutcome<T> = await process_retry_attempt(
			config,
			context,
			attempt_label,
			last_retry_details,
		)

		if (outcome.type === 'success') {
			return outcome.value
		}

		last_retry_details = outcome.retry_details
	}

	throw error_utilities.build_retry_failure_error(`${config.label} failed.`, last_retry_details)
}

export type { RetryConfig, RetryStepResult }

export const retry_helpers = {
	DEFAULT_RETRY_DELAY_MS,
	retry_with_status,
	wait_for,
}
