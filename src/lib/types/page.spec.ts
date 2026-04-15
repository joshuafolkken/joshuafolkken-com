import { describe, expect, it } from 'vitest'
import { MAIN_NAV_PAGES, PAGES } from './page'

describe('PAGES registry', () => {
	it('links Privacy Policy to /privacy', () => {
		expect(PAGES.PRIVACY_POLICY.link).toBe('/privacy')
		expect(PAGES.PRIVACY_POLICY.title).toBe('Privacy Policy')
		expect(PAGES.PRIVACY_POLICY.icon).toBeDefined()
	})

	it('links Terms of Service to /terms', () => {
		expect(PAGES.TERMS_OF_SERVICE.link).toBe('/terms')
		expect(PAGES.TERMS_OF_SERVICE.title).toBe('Terms of Service')
		expect(PAGES.TERMS_OF_SERVICE.description).toBeTruthy()
		expect(PAGES.TERMS_OF_SERVICE.icon).toBeDefined()
	})

	it('links About to /about with AdSense-friendly metadata', () => {
		expect(PAGES.ABOUT.link).toBe('/about')
		expect(PAGES.ABOUT.title).toBe('About')
		expect(PAGES.ABOUT.description).toBe('Who I am and what I build')
		expect(PAGES.ABOUT.icon).toBeDefined()
	})

	it('includes About in MAIN_NAV_PAGES', () => {
		expect(MAIN_NAV_PAGES).toContain(PAGES.ABOUT)
	})
})
