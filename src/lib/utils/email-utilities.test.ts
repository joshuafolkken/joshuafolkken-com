import { describe, expect, it } from 'vitest'
import { email_utilities } from './email-utilities'

const SAMPLE_LOCAL = 'user'
const SAMPLE_DOMAIN = 'example.com'
const SAMPLE_EMAIL = 'user@example.com'

describe('email_utilities.assemble', () => {
	it('joins local and domain parts with an @ sign', () => {
		expect(email_utilities.assemble(SAMPLE_LOCAL, SAMPLE_DOMAIN)).toBe(SAMPLE_EMAIL)
	})

	it('does not require the inputs to contain an @ sign', () => {
		const local = 'alice'
		const domain = 'corp.example.com'

		expect(local).not.toContain('@')
		expect(domain).not.toContain('@')
		expect(email_utilities.assemble(local, domain)).toBe('alice@corp.example.com')
	})
})

describe('email_utilities.split', () => {
	it('splits a normal email into local and domain parts', () => {
		expect(email_utilities.split(SAMPLE_EMAIL)).toEqual({
			local: SAMPLE_LOCAL,
			domain: SAMPLE_DOMAIN,
		})
	})

	it('returns empty domain for a string without an @ sign', () => {
		expect(email_utilities.split('noop')).toEqual({ local: 'noop', domain: '' })
	})

	it('round-trips through assemble', () => {
		const original = 'joshuafolkken@gmail.com'
		const { local, domain } = email_utilities.split(original)

		expect(email_utilities.assemble(local, domain)).toBe(original)
	})
})
