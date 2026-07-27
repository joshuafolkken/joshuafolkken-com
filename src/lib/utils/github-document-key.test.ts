import { describe, expect, it } from 'vitest'
import { github_document_key } from './github-document-key'

const REPO = 'kit'
const DOC_PATH = 'docs/package.md'
const DOC_KEY = 'github__kit__docs__package.md'
const README_KEY = 'github__kit__README.md'
const DOC_DISPLAY = 'docs/package.md — kit'

describe('github_document_key.is_github_key', () => {
	it('is true for a key carrying the github prefix', () => {
		expect(github_document_key.is_github_key(DOC_KEY)).toBe(true)
	})

	it('is false for a key without the github prefix', () => {
		expect(github_document_key.is_github_key('site__docs__page.md')).toBe(false)
	})
})

describe('github_document_key.build_key', () => {
	it('flattens path separators and keeps the markdown extension', () => {
		expect(github_document_key.build_key(REPO, DOC_PATH)).toBe(DOC_KEY)
	})

	it('keeps a root README as a flat key', () => {
		expect(github_document_key.build_key(REPO, 'README.md')).toBe(README_KEY)
	})
})

describe('github_document_key.parse_key', () => {
	it('inverts a flattened key into repo and slashed path', () => {
		expect(github_document_key.parse_key(DOC_KEY)).toStrictEqual({ repo: REPO, path: DOC_PATH })
	})

	it('parses a root README key', () => {
		expect(github_document_key.parse_key(README_KEY)).toStrictEqual({
			repo: REPO,
			path: 'README.md',
		})
	})

	it('round-trips with build_key', () => {
		expect(
			github_document_key.parse_key(github_document_key.build_key(REPO, DOC_PATH)),
		).toStrictEqual({
			repo: REPO,
			path: DOC_PATH,
		})
	})

	it('returns undefined for a non-github key', () => {
		expect(github_document_key.parse_key('https://example.com')).toBeUndefined()
	})

	it('returns undefined when there is no path segment', () => {
		expect(github_document_key.parse_key('github__kit')).toBeUndefined()
	})

	it('returns undefined for a trailing separator that yields an empty path', () => {
		expect(github_document_key.parse_key('github__kit__')).toBeUndefined()
		expect(github_document_key.parse_key('github__kit__docs__')).toBeUndefined()
	})
})

describe('github_document_key.to_github_url', () => {
	it('builds a blob URL on the default branch', () => {
		expect(github_document_key.to_github_url({ repo: REPO, path: DOC_PATH })).toBe(
			'https://github.com/joshuafolkken/kit/blob/main/docs/package.md',
		)
	})
})

describe('github_document_key.parse_label_key', () => {
	it('parses a key the model wrote as the whole citation label', () => {
		expect(github_document_key.parse_label_key(README_KEY)).toStrictEqual({
			repo: REPO,
			path: 'README.md',
		})
	})

	it('stops at the repo suffix the model appends after the key', () => {
		expect(github_document_key.parse_label_key(`${DOC_KEY} — ${REPO}`)).toStrictEqual({
			repo: REPO,
			path: DOC_PATH,
		})
	})

	it('leaves prose that merely mentions a key-shaped token alone', () => {
		// A rewrite replaces the whole label, so matching mid-sentence would discard the sentence.
		expect(github_document_key.parse_label_key(`See ${DOC_KEY} for details`)).toBeUndefined()
	})

	it('returns undefined for text carrying no key', () => {
		expect(github_document_key.parse_label_key(DOC_DISPLAY)).toBeUndefined()
	})

	it('returns undefined for a prefix that never completes into a key', () => {
		expect(github_document_key.parse_label_key('github__kit')).toBeUndefined()
	})
})

describe('github_document_key.to_display_text', () => {
	it('renders the prompt-mandated path and repo without the flattened separators', () => {
		expect(github_document_key.to_display_text({ repo: REPO, path: DOC_PATH })).toBe(DOC_DISPLAY)
	})

	it('round-trips a parsed key into a clean label', () => {
		const parsed = github_document_key.parse_key(README_KEY)

		expect(parsed && github_document_key.to_display_text(parsed)).toBe('README.md — kit')
	})
})
