import { isRedirect } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import { describe, expect, it } from 'vitest'
import { GET } from './+server'

const PRIVACY_PATH = '/privacy'

describe('/privacy-policy redirect endpoint', () => {
	it('redirects permanently to /privacy', async () => {
		try {
			// @ts-expect-error — handler expects a RequestEvent but never reads it
			await GET({})
			expect.fail('GET should have thrown a redirect')
		} catch (error) {
			if (!isRedirect(error)) throw error

			expect(error.status).toBe(HTTP_STATUS.PERMANENT_REDIRECT)
			expect(error.location).toBe(PRIVACY_PATH)
		}
	})
})
