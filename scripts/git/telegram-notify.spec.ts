import { describe, expect, it } from 'vitest'
import { build_text } from './telegram-notify'

const ISSUE_URL = 'https://github.com/owner/repo/issues/1'
const PR_URL = 'https://github.com/owner/repo/pull/2'
const MESSAGE = 'tasks\nFix something'

describe('build_text — with URLs', () => {
	it('joins title and issue title with single newline, URLs with double newline', () => {
		const result = build_text({ message: MESSAGE, issue_url: ISSUE_URL, pr_url: PR_URL })

		expect(result).toBe(`✅ tasks\nFix something\n\nIssue: ${ISSUE_URL}\n\nPR: ${PR_URL}`)
	})

	it('omits Issue line when issue_url is undefined', () => {
		const result = build_text({ message: MESSAGE, issue_url: undefined, pr_url: PR_URL })

		expect(result).toBe(`✅ tasks\nFix something\n\nPR: ${PR_URL}`)
	})
})

describe('build_text — without URLs', () => {
	it('prepends ✅ to the first line only', () => {
		const result = build_text({ message: MESSAGE, issue_url: undefined, pr_url: undefined })

		expect(result).toBe('✅ tasks\nFix something')
	})

	it('handles single-line message without bullets', () => {
		const result = build_text({
			message: 'PR followup completed.',
			issue_url: undefined,
			pr_url: undefined,
		})

		expect(result).toBe('✅ PR followup completed.')
	})
})
