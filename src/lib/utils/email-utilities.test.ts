import { AUTHOR_EMAIL_ENCODED } from '$lib/app'
import { describe, expect, it } from 'vitest'
import { email_utilities } from './email-utilities'

const SAMPLE_LOCAL = 'user'
const SAMPLE_DOMAIN = 'example.com'
const SAMPLE_EMAIL = 'user@example.com'
const AUTHOR_EMAIL = 'joshuafolkken@gmail.com'

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
		const { local, domain } = email_utilities.split(AUTHOR_EMAIL)

		expect(email_utilities.assemble(local, domain)).toBe(AUTHOR_EMAIL)
	})
})

describe('email_utilities.encode_xor / decode_xor', () => {
	it('round-trips encode then decode back to original text', () => {
		const original = SAMPLE_EMAIL

		expect(email_utilities.decode_xor(email_utilities.encode_xor(original))).toBe(original)
	})

	it('encoded array contains no string representation of the original', () => {
		const encoded = email_utilities.encode_xor(SAMPLE_EMAIL)

		expect(encoded.join('')).not.toContain(SAMPLE_EMAIL)
		expect(JSON.stringify(encoded)).not.toContain(SAMPLE_EMAIL)
	})

	it('decodes AUTHOR_EMAIL_ENCODED to the expected author email', () => {
		expect(email_utilities.decode_xor(AUTHOR_EMAIL_ENCODED)).toBe(AUTHOR_EMAIL)
	})

	it('AUTHOR_EMAIL_ENCODED is an array of numbers with no plain email string', () => {
		expect(AUTHOR_EMAIL_ENCODED.every((code_point) => typeof code_point === 'number')).toBe(true)
		expect(AUTHOR_EMAIL_ENCODED.join(',')).not.toContain(AUTHOR_EMAIL)
	})
})
