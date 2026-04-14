import { describe, expect, it } from 'vitest'
import {
	build_failure_body,
	build_telegram_input,
	parse_repo_name,
	type TelegramContext,
} from './git-pr-followup'

const FAILURE_MESSAGE = 'Required check X failed'
const FAILURE_BODY = `CI check failed:\n${FAILURE_MESSAGE}`

const CONTEXT: TelegramContext = {
	repo_name: 'joshuafolkken-com',
	issue_title: 'Fix bug',
	issue_url: 'https://github.com/owner/repo/issues/1',
	pr_url: 'https://github.com/owner/repo/pull/2',
}

describe('parse_repo_name', () => {
	it('returns the repo name from owner/repo format', () => {
		expect(parse_repo_name('joshuafolkken/tasks')).toBe('tasks')
	})

	it('returns undefined when input is undefined', () => {
		const input: string | undefined = undefined

		expect(parse_repo_name(input)).toBeUndefined()
	})
})

describe('build_telegram_input', () => {
	it('forwards context fields and task_type onto the send input', () => {
		const result = build_telegram_input({
			task_type: 'completion',
			context: CONTEXT,
			body: undefined,
		})

		expect(result).toStrictEqual({
			task_type: 'completion',
			repo_name: CONTEXT.repo_name,
			issue_title: CONTEXT.issue_title,
			body: undefined,
			issue_url: CONTEXT.issue_url,
			pr_url: CONTEXT.pr_url,
		})
	})

	it('applies failure task_type with a provided body', () => {
		const result = build_telegram_input({
			task_type: 'failure',
			context: CONTEXT,
			body: FAILURE_BODY,
		})

		expect(result.task_type).toBe('failure')
		expect(result.body).toBe(FAILURE_BODY)
	})
})

describe('build_failure_body', () => {
	it('prefixes Error messages with "CI check failed:"', () => {
		expect(build_failure_body(new Error(FAILURE_MESSAGE))).toBe(FAILURE_BODY)
	})

	it('stringifies non-Error values', () => {
		expect(build_failure_body('boom')).toBe('CI check failed:\nboom')
	})
})
