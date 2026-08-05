/* eslint-disable @typescript-eslint/triple-slash-reference -- tsgo needs explicit reference for Cloudflare types */
/// <reference path="../../../worker-configuration.d.ts" />
import { HSTS_VALUE, PERMISSIONS_POLICY_VALUE } from '$lib/constants/security'
import { logger } from '$lib/logger'
import { platform_binding } from '$lib/server/platform-binding'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { security, type SecurityContext } from './security'

vi.mock('$lib/logger', () => ({
	logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

vi.mock('$lib/server/platform-binding', () => ({
	platform_binding: {
		get_rate_limiter: vi.fn(),
	},
}))

const APP_ID = 'joshuafolkken-com'
const BASE_URL = 'https://joshuafolkken.com/api/test'
const SAME_ORIGIN = 'https://joshuafolkken.com'
const DIFFERENT_ORIGIN = 'https://evil.example.com'
const LOCALHOST_ORIGIN = 'http://localhost:5173'
const INVALID_ORIGIN = 'not-a-url'
// eslint-disable-next-line sonarjs/no-hardcoded-ip -- test fixture
const DUMMY_IP = '10.0.0.1'
const RATE_LIMITER_ERROR_MSG = 'Rate limiter not available'

function make_rate_limiter(is_success: boolean): RateLimit {
	return { limit: vi.fn().mockResolvedValue({ success: is_success }) }
}

function make_request(options: { origin?: string; client?: string } = {}): Request {
	const headers = new Headers({ 'X-App-Client': APP_ID })

	if (options.origin !== undefined) headers.set('origin', options.origin)
	if (options.client !== undefined) headers.set('X-App-Client', options.client)

	return new Request(BASE_URL, { headers })
}

function make_platform(is_success: boolean): App.Platform {
	vi.mocked(platform_binding.get_rate_limiter).mockReturnValue(make_rate_limiter(is_success))

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- mock stub; App.Platform shape not needed in test
	return {} as App.Platform
}

function make_platform_no_limiter(): App.Platform {
	vi.mocked(platform_binding.get_rate_limiter).mockImplementation(() => {
		throw new Error(RATE_LIMITER_ERROR_MSG)
	})

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- mock stub; App.Platform shape not needed in test
	return {} as App.Platform
}

function make_context(
	options: {
		origin?: string
		client?: string
		platform?: App.Platform
	} = {},
): SecurityContext {
	const request_options: { origin?: string; client?: string } = {}

	if (options.origin !== undefined) request_options.origin = options.origin
	if (options.client !== undefined) request_options.client = options.client

	return {
		request: make_request(request_options),
		url: new URL(BASE_URL),
		ip: DUMMY_IP,
		platform: options.platform,
	}
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('security.add_security_headers', () => {
	it.each([
		['X-Content-Type-Options', 'nosniff'],
		// Regression: X-Frame-Options converged to DENY (was SAMEORIGIN) via the app-kit baseline.
		['X-Frame-Options', 'DENY'],
		['Referrer-Policy', 'strict-origin-when-cross-origin'],
		['Strict-Transport-Security', HSTS_VALUE],
		['Permissions-Policy', PERMISSIONS_POLICY_VALUE],
		// Literal, like the other baseline-owned values above and unlike the site-owned constants:
		// app-kit applies COOP itself since 0.71.0 (#810), so importing a local constant would
		// re-create the second source that change removed. Pinning the value here is what makes an
		// upstream relaxation to `same-origin-allow-popups` fail loudly instead of silently
		// weakening this site, and it still catches the header being dropped entirely (#803).
		['Cross-Origin-Opener-Policy', 'same-origin'],
	])('sets %s', (header, value) => {
		const response = new Response()

		security.add_security_headers(response)

		expect(response.headers.get(header)).toBe(value)
	})

	// Regression: the CSP moved to `kit.csp` (svelte.config.js) so SvelteKit can attach the
	// per-request nonce. Re-adding it here would overwrite that header with a nonce-less copy
	// and block every inline script on the page.
	it('leaves Content-Security-Policy to SvelteKit', () => {
		const response = new Response()

		security.add_security_headers(response)

		expect(response.headers.get('Content-Security-Policy')).toBeNull()
	})
})

describe('security.json_error', () => {
	const FORBIDDEN_MESSAGE = 'Forbidden'

	it('returns a response with the given HTTP status', () => {
		const response = security.json_error(FORBIDDEN_MESSAGE, 403)

		expect(response.status).toBe(403)
	})

	it('includes the error message in the JSON body', async () => {
		const response = security.json_error(FORBIDDEN_MESSAGE, 403)
		const body = await response.json()

		expect(body).toEqual({ error: FORBIDDEN_MESSAGE })
	})
})

describe('security.validate_request_security — rate limit', () => {
	it('allows the request when Cloudflare binding returns success', async () => {
		const result = await security.validate_request_security(
			make_context({ platform: make_platform(true) }),
		)

		expect(result).toBeUndefined()
	})

	it('returns 429 when Cloudflare binding returns failure', async () => {
		const result = await security.validate_request_security(
			make_context({ platform: make_platform(false) }),
		)

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(429)
	})

	it('skips rate limiting when platform is undefined', async () => {
		const result = await security.validate_request_security(make_context())

		expect(result).toBeUndefined()
		expect(platform_binding.get_rate_limiter).not.toHaveBeenCalled()
	})

	it('skips rate limiting when the rate limiter binding is unavailable', async () => {
		const result = await security.validate_request_security(
			make_context({ platform: make_platform_no_limiter() }),
		)

		expect(result).toBeUndefined()
	})

	it('logs an error when the rate limiter binding is unavailable', async () => {
		await security.validate_request_security(make_context({ platform: make_platform_no_limiter() }))

		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('[RateLimit]'))
	})
})

describe('security.validate_request_security — custom header', () => {
	it('returns undefined when the correct app client header is present', async () => {
		const result = await security.validate_request_security(make_context())

		expect(result).toBeUndefined()
	})

	it('returns 403 when the app client header is missing', async () => {
		const result = await security.validate_request_security(make_context({ client: '' }))

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(403)
	})

	it('returns 403 when the app client header has an incorrect value', async () => {
		const result = await security.validate_request_security(
			make_context({ client: 'wrong-client' }),
		)

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(403)
	})
})

describe('security.validate_request_security — origin (allowed)', () => {
	it('returns undefined when no origin header is present', async () => {
		const result = await security.validate_request_security(make_context())

		expect(result).toBeUndefined()
	})

	it('returns undefined when origin matches the request URL', async () => {
		const result = await security.validate_request_security(make_context({ origin: SAME_ORIGIN }))

		expect(result).toBeUndefined()
	})

	it('returns undefined when origin is localhost', async () => {
		const result = await security.validate_request_security(
			make_context({ origin: LOCALHOST_ORIGIN }),
		)

		expect(result).toBeUndefined()
	})
})

describe('security.validate_request_security — origin (blocked)', () => {
	it('returns 403 when origin does not match the request URL', async () => {
		const result = await security.validate_request_security(
			make_context({ origin: DIFFERENT_ORIGIN }),
		)

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(403)
	})

	it('returns 403 when origin is not a valid URL', async () => {
		const result = await security.validate_request_security(
			make_context({ origin: INVALID_ORIGIN }),
		)

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(403)
	})
})
