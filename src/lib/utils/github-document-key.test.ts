import { describe, expect, it } from 'vitest'
import { github_document_key } from './github-document-key'

const REPO = 'kit'
const DOC_PATH = 'docs/package.md'
const DOC_KEY = 'github__kit__docs__package.md'
const README_KEY = 'github__kit__README.md'

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

describe('github_document_key.to_display_text', () => {
	it('joins repo and path without the flattened separators', () => {
		expect(github_document_key.to_display_text({ repo: REPO, path: DOC_PATH })).toBe(
			'kit/docs/package.md',
		)
	})
})
