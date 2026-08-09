import { describe, expect, it } from 'vitest'
import { blog_redirects } from './blog-redirects'

const SIMON_PATH = '/blog/simon'
const MNEMECHA_PATH = '/blog/mnemecha'
const LEGACY_TALK_PATH = '/blog/talk-2025-12-12'
const CANONICAL_TALK_PATH = '/blog/talk-2025-12-11'

describe('blog_redirects.get_redirect_target', () => {
	it(`maps ${SIMON_PATH} to ${MNEMECHA_PATH}`, () => {
		expect(blog_redirects.get_redirect_target(SIMON_PATH)).toBe(MNEMECHA_PATH)
	})

	it(`maps ${SIMON_PATH}/ (trailing slash) to ${MNEMECHA_PATH}`, () => {
		expect(blog_redirects.get_redirect_target(`${SIMON_PATH}/`)).toBe(MNEMECHA_PATH)
	})

	it(`returns undefined for the new canonical path ${MNEMECHA_PATH}`, () => {
		expect(blog_redirects.get_redirect_target(MNEMECHA_PATH)).toBeUndefined()
	})

	it(`maps ${LEGACY_TALK_PATH} to ${CANONICAL_TALK_PATH} after the broadcast-date correction`, () => {
		expect(blog_redirects.get_redirect_target(LEGACY_TALK_PATH)).toBe(CANONICAL_TALK_PATH)
	})

	it(`returns undefined for the corrected talk path ${CANONICAL_TALK_PATH}`, () => {
		expect(blog_redirects.get_redirect_target(CANONICAL_TALK_PATH)).toBeUndefined()
	})

	it('returns undefined for an unknown blog slug', () => {
		expect(blog_redirects.get_redirect_target('/blog/something-else')).toBeUndefined()
	})

	it('returns undefined for a non-blog path', () => {
		expect(blog_redirects.get_redirect_target('/projects')).toBeUndefined()
	})

	it('returns undefined for /blog index page', () => {
		expect(blog_redirects.get_redirect_target('/blog')).toBeUndefined()
		expect(blog_redirects.get_redirect_target('/blog/')).toBeUndefined()
	})

	it('returns undefined for nested paths under a legacy slug', () => {
		expect(blog_redirects.get_redirect_target('/blog/simon/extra')).toBeUndefined()
	})
})
