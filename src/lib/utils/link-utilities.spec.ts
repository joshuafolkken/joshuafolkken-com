import { describe, expect, it } from 'vitest'
import { INTERNAL_PATHS, link_utilities } from './link-utilities'

const EXTERNAL_HTTP = 'http://example.com'
const EXTERNAL_HTTPS = 'https://example.com/path'
const DYNAMIC_BLOG_POST = '/blog/kit-package'
const UNKNOWN_INTERNAL = '/not-a-real-route'
const NON_PATH_STRING = 'about'

describe('link_utilities.is_internal_path', () => {
	it('returns true for every value in INTERNAL_PATHS', () => {
		for (const path of INTERNAL_PATHS) {
			expect(link_utilities.is_internal_path(path)).toBe(true)
		}
	})

	it('returns false for an unknown route literal', () => {
		expect(link_utilities.is_internal_path(UNKNOWN_INTERNAL)).toBe(false)
	})

	it('returns false for an empty string', () => {
		expect(link_utilities.is_internal_path('')).toBe(false)
	})

	it('returns false for paths missing the leading slash', () => {
		expect(link_utilities.is_internal_path(NON_PATH_STRING)).toBe(false)
	})

	it('returns false for dynamic blog post paths (only the index is static)', () => {
		expect(link_utilities.is_internal_path(DYNAMIC_BLOG_POST)).toBe(false)
	})
})

describe('link_utilities.is_external_link', () => {
	it('returns true for http URLs', () => {
		expect(link_utilities.is_external_link(EXTERNAL_HTTP)).toBe(true)
	})

	it('returns true for https URLs', () => {
		expect(link_utilities.is_external_link(EXTERNAL_HTTPS)).toBe(true)
	})

	it('returns false for internal paths', () => {
		expect(link_utilities.is_external_link('/about')).toBe(false)
	})

	it('returns false for undefined', () => {
		expect(link_utilities.is_external_link()).toBe(false)
	})
})

describe('link_utilities.get_href', () => {
	it('returns undefined for an undefined link', () => {
		expect(link_utilities.get_href()).toBeUndefined()
	})

	it('returns the original URL for external http links', () => {
		expect(link_utilities.get_href(EXTERNAL_HTTPS)).toBe(EXTERNAL_HTTPS)
	})

	it('returns a resolved string for known internal paths', () => {
		const href = link_utilities.get_href('/about')

		expect(typeof href).toBe('string')
		expect(href?.endsWith('/about')).toBe(true)
	})

	it('returns a resolved string for dynamic blog post paths', () => {
		const href = link_utilities.get_href(DYNAMIC_BLOG_POST)

		expect(typeof href).toBe('string')
		expect(href?.endsWith(DYNAMIC_BLOG_POST)).toBe(true)
	})

	it('returns the path as-is for unrecognized internal-looking paths', () => {
		expect(link_utilities.get_href(UNKNOWN_INTERNAL)).toBe(UNKNOWN_INTERNAL)
	})

	it('returns undefined for non-path strings', () => {
		expect(link_utilities.get_href(NON_PATH_STRING)).toBeUndefined()
	})

	it('returns undefined for an empty string', () => {
		expect(link_utilities.get_href('')).toBeUndefined()
	})
})

describe('link_utilities.get_link_info', () => {
	it('marks external links as external with target and rel', () => {
		const info = link_utilities.get_link_info(EXTERNAL_HTTPS)

		expect(info.is_external).toBe(true)
		expect(info.is_link).toBe(false)
		expect(info.target).toBe('_blank')
		expect(info.rel).toBe('noopener noreferrer')
	})

	it('marks known internal paths as internal links', () => {
		const info = link_utilities.get_link_info('/projects')

		expect(info.is_link).toBe(true)
		expect(info.is_external).toBe(false)
		expect(info.target).toBeUndefined()
		expect(info.rel).toBeUndefined()
	})

	it('treats unrecognized internal-looking paths as internal links', () => {
		const info = link_utilities.get_link_info(UNKNOWN_INTERNAL)

		expect(info.href).toBe(UNKNOWN_INTERNAL)
		expect(info.is_link).toBe(true)
		expect(info.is_external).toBe(false)
	})

	it('returns no href for non-path strings', () => {
		const info = link_utilities.get_link_info(NON_PATH_STRING)

		expect(info.href).toBeUndefined()
		expect(info.is_link).toBe(false)
		expect(info.is_external).toBe(false)
	})
})
