import { expect, test } from 'vitest'
import { CONTACT_HREF, PRIVACY_HREF, TERMS_HREF } from './page-routes'

test('CONTACT_HREF resolves to a path ending in /contact', () => {
	expect(CONTACT_HREF).toMatch('/contact')
})

test('PRIVACY_HREF resolves to a path ending in /privacy', () => {
	expect(PRIVACY_HREF).toMatch('/privacy')
})

test('TERMS_HREF resolves to a path ending in /terms', () => {
	expect(TERMS_HREF).toMatch('/terms')
})
