import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { preview } from './preview'

const POST_PATH = 'src/lib/posts/talk-2025-11-27.md'
const SLUG = 'talk-2025-11-27'
const DEV_PORT_BASE = 5173
const SEED = 3
const BLANK_SEED = ''
const ZERO_SEED = '0'
const INVALID_SEED = 'abc'
const OVERRIDE_BASE_URL = 'https://joshuafolkken.com/blog/'
const OVERRIDE_URL = `https://joshuafolkken.com/blog/${SLUG}`

function blog_url(port: number): string {
	return `http://localhost:${String(port)}/blog/${SLUG}`
}

// Every case pins PORT_SEED: the default base URL follows the seed, and kit's loader reads this
// repository's own `.env` when the variable is absent, so an unpinned test would pass or fail
// depending on the developer's personal seed. A blank value is the shape `.env.example` ships and
// the one every un-seeded machine runs with; a value already in the environment wins over the file.
beforeEach(() => {
	vi.stubEnv('PORT_SEED', BLANK_SEED)
})

afterEach(() => {
	vi.unstubAllEnvs()
	vi.restoreAllMocks()
})

describe('preview.build_preview_url', () => {
	it('maps a post path to the historical dev port when the seed is blank', () => {
		expect(preview.build_preview_url(POST_PATH)).toBe(blog_url(DEV_PORT_BASE))
	})

	it('treats an explicit zero seed the same as blank', () => {
		vi.stubEnv('PORT_SEED', ZERO_SEED)

		expect(preview.build_preview_url(POST_PATH)).toBe(blog_url(DEV_PORT_BASE))
	})

	it('accepts a bare filename', () => {
		expect(preview.build_preview_url(`${SLUG}.md`)).toBe(blog_url(DEV_PORT_BASE))
	})

	it('follows PORT_SEED so a seeded project opens its own dev server', () => {
		vi.stubEnv('PORT_SEED', String(SEED))

		expect(preview.build_preview_url(POST_PATH)).toBe(blog_url(DEV_PORT_BASE + SEED))
	})

	it('honors a PREVIEW_BASE_URL override and strips its trailing slash', () => {
		vi.stubEnv('PREVIEW_BASE_URL', OVERRIDE_BASE_URL)

		expect(preview.build_preview_url(POST_PATH)).toBe(OVERRIDE_URL)
	})

	// The override bypasses port resolution entirely, so a seed that would be rejected for the
	// servers must not be consulted — the default is evaluated lazily.
	it('never resolves the port while PREVIEW_BASE_URL overrides it', () => {
		vi.stubEnv('PORT_SEED', INVALID_SEED)
		vi.stubEnv('PREVIEW_BASE_URL', OVERRIDE_BASE_URL)

		expect(preview.build_preview_url(POST_PATH)).toBe(OVERRIDE_URL)
	})

	it('rejects an invalid seed when the default URL is needed', () => {
		vi.stubEnv('PORT_SEED', INVALID_SEED)

		expect(() => preview.build_preview_url(POST_PATH)).toThrow('PORT_SEED')
	})
})

describe('preview.open_post_preview', () => {
	// The post is already written by the time this runs, so an invalid seed must degrade to a
	// warning instead of failing a command whose expensive work already succeeded.
	it('warns instead of throwing when the seed is invalid', () => {
		vi.stubEnv('PORT_SEED', INVALID_SEED)
		const warn = vi.spyOn(console, 'warn').mockReturnValue(undefined)

		expect(() => {
			preview.open_post_preview(POST_PATH)
		}).not.toThrow()
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('PORT_SEED'))
	})
})
