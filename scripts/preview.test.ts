import { afterEach, describe, expect, it, vi } from 'vitest'
import { preview } from './preview'

const POST_PATH = 'src/lib/posts/talk-2025-11-27.md'
const EXPECTED_URL = 'http://localhost:5173/blog/talk-2025-11-27'

afterEach(() => {
	vi.unstubAllEnvs()
})

describe('preview.build_preview_url', () => {
	it('maps a post path to its localhost blog route', () => {
		expect(preview.build_preview_url(POST_PATH)).toBe(EXPECTED_URL)
	})

	it('accepts a bare filename', () => {
		expect(preview.build_preview_url('talk-2025-11-27.md')).toBe(EXPECTED_URL)
	})

	it('honors a PREVIEW_BASE_URL override and strips its trailing slash', () => {
		vi.stubEnv('PREVIEW_BASE_URL', 'https://joshuafolkken.com/blog/')

		expect(preview.build_preview_url(POST_PATH)).toBe(
			'https://joshuafolkken.com/blog/talk-2025-11-27',
		)
	})
})
