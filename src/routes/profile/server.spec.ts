import { isRedirect } from '@sveltejs/kit'
import { describe, expect, it } from 'vitest'
import { GET } from './+server'

const PERMANENT_REDIRECT_STATUS = 308
const ABOUT_PATH = '/about'

describe('/profile redirect endpoint', () => {
	it('redirects permanently to /about', async () => {
		try {
			// @ts-expect-error — handler expects a RequestEvent but never reads it
			await GET({})
			expect.fail('GET should have thrown a redirect')
		} catch (error) {
			if (!isRedirect(error)) throw error

			expect(error.status).toBe(PERMANENT_REDIRECT_STATUS)
			expect(error.location).toBe(ABOUT_PATH)
		}
	})
})
