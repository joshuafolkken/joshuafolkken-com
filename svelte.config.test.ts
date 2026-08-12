import { describe, expect, it } from 'vitest'
import config from './svelte.config.js'

const csp = config.kit?.csp
const directives = csp?.directives ?? {}
const UNSAFE_INLINE = 'unsafe-inline'
const GOOGLE_TAG_MANAGER = 'https://www.googletagmanager.com'

describe('kit.csp: script policy', () => {
	it('generates a nonce for server-rendered pages', () => {
		expect(csp?.mode).toBe('auto')
	})

	// The whole point of the nonce migration: an inline script must carry the nonce, so
	// 'unsafe-inline' has to be gone. Re-adding it would silently disable the nonce for
	// CSP2 browsers and re-open the ZAP 10055 script-src finding.
	it("omits 'unsafe-inline' from script-src", () => {
		expect(directives['script-src']).not.toContain(UNSAFE_INLINE)
	})

	it('keeps script-src restricted to self plus the Google tag origins', () => {
		expect(directives['script-src']).toStrictEqual([
			'self',
			GOOGLE_TAG_MANAGER,
			'https://*.googlesyndication.com',
			'https://*.doubleclick.net',
		])
	})

	// Leaving script-src-attr unset makes it fall back to the nonce-checked script-src, so inline
	// event-handler attributes stay blocked. Re-adding it would silently re-open that surface.
	it('does not relax script-src-attr', () => {
		expect(directives['script-src-attr']).toBeUndefined()
	})
})

describe('kit.csp: style and framing policy', () => {
	// Svelte transitions inject inline <style> at runtime, and SvelteKit only skips adding a
	// style nonce while 'unsafe-inline' is present — a nonce there would make CSP3 browsers
	// ignore 'unsafe-inline' and break the transitions.
	it("keeps 'unsafe-inline' in style-src", () => {
		expect(directives['style-src']).toContain(UNSAFE_INLINE)
	})

	it('disables object-src', () => {
		expect(directives['object-src']).toStrictEqual(['none'])
	})

	it("denies framing via frame-ancestors 'none' (aligned with X-Frame-Options: DENY)", () => {
		expect(directives['frame-ancestors']).toStrictEqual(['none'])
	})
})

describe('kit.csp: third-party origins', () => {
	it('allows the Google Fonts origins', () => {
		expect(directives['style-src']).toContain('https://fonts.googleapis.com')
		expect(directives['font-src']).toContain('https://fonts.gstatic.com')
	})

	it('allows the YouTube embed origin in frame-src', () => {
		expect(directives['frame-src']).toContain('https://www.youtube-nocookie.com')
	})

	// The embed origin does not serve the stills: talk posts render their card image and social
	// preview from i.ytimg.com, so dropping it leaves every talk card with a blocked image.
	it('allows the YouTube thumbnail CDN in img-src', () => {
		expect(directives['img-src']).toContain('https://i.ytimg.com')
	})

	// The Google tag delivers its /td? measurement beacon as an image. Dropping this origin from
	// img-src blocks the beacon while the page keeps rendering, so analytics stops with nothing
	// but a console entry to say so — the failure mode this assertion exists to catch.
	it('allows the Google tag origin in img-src for the measurement beacon', () => {
		expect(directives['img-src']).toContain(GOOGLE_TAG_MANAGER)
	})
})
