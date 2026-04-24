import { describe, expect, it } from 'vitest'
import { FOOTER_LINKS } from './footer-links'

describe('FOOTER_LINKS', () => {
	it('includes Privacy as the first entry pointing to /privacy', () => {
		const [first] = FOOTER_LINKS

		expect(first?.title).toBe('Privacy')
		expect(first?.href.endsWith('/privacy')).toBe(true)
	})

	it('lists Privacy, Terms, About, Contact in order', () => {
		const titles = FOOTER_LINKS.map((link) => link.title)

		expect(titles).toEqual(['Privacy', 'Terms', 'About', 'Contact'])
	})

	it('points each link to the correct href', () => {
		const hrefs = FOOTER_LINKS.map((link) => link.href)

		expect(hrefs[0]?.endsWith('/privacy')).toBe(true)
		expect(hrefs[1]?.endsWith('/terms')).toBe(true)
		expect(hrefs[2]?.endsWith('/about')).toBe(true)
		expect(hrefs[3]?.endsWith('/contact')).toBe(true)
	})
})
