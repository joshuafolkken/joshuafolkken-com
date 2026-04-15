import { describe, expect, it } from 'vitest'
import { FOOTER_LINKS } from './footer-links'

describe('FOOTER_LINKS', () => {
	it('includes About as the first entry pointing to /about', () => {
		const [first] = FOOTER_LINKS

		expect(first?.title).toBe('About')
		expect(first?.href.endsWith('/about')).toBe(true)
	})

	it('lists About, Contact, Privacy Policy, Terms of Service in order', () => {
		const titles = FOOTER_LINKS.map((link) => link.title)

		expect(titles).toEqual(['About', 'Contact', 'Privacy Policy', 'Terms of Service'])
	})
})
