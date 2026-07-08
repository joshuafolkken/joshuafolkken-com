import { describe, expect, it } from 'vitest'
import { github_url } from './github-url'

describe('github_url.RAW_HOST', () => {
	it('points at the raw content host', () => {
		expect(github_url.RAW_HOST).toBe('https://raw.githubusercontent.com')
	})
})

describe('github_url.encode_url_path', () => {
	it('encodes each segment but keeps the separators', () => {
		expect(github_url.encode_url_path('docs/with space.md')).toBe('docs/with%20space.md')
	})

	it('leaves a plain path unchanged', () => {
		expect(github_url.encode_url_path('README.md')).toBe('README.md')
	})
})
