import { describe, expect, it } from 'vitest'
import { PAGES } from './page'

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
})
