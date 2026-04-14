import { describe, expect, it } from 'vitest'
import { build_telegram_message, parse_repo_name } from './git-pr-followup'

const DEFAULT_MESSAGE = 'PR followup completed.'
const ISSUE_TITLE = 'Fix the bug'

describe('parse_repo_name', () => {
	it('returns the repo name from owner/repo format', () => {
		expect(parse_repo_name('joshuafolkken/tasks')).toBe('tasks')
	})

	it('returns undefined when input is undefined', () => {
		const input: string | undefined = undefined

		expect(parse_repo_name(input)).toBeUndefined()
	})
})

describe('build_telegram_message', () => {
	it('returns repo name and issue title joined by newline', () => {
		expect(build_telegram_message({ repo_name: 'tasks', issue_title: ISSUE_TITLE })).toBe(
			`tasks\n${ISSUE_TITLE}`,
		)
	})

	it('returns default message when repo_name is undefined', () => {
		expect(build_telegram_message({ repo_name: undefined, issue_title: ISSUE_TITLE })).toBe(
			DEFAULT_MESSAGE,
		)
	})

	it('returns default message when issue_title is undefined', () => {
		expect(build_telegram_message({ repo_name: 'tasks', issue_title: undefined })).toBe(
			DEFAULT_MESSAGE,
		)
	})
})
