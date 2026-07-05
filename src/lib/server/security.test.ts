/* eslint-disable @typescript-eslint/triple-slash-reference -- tsgo needs explicit reference for Cloudflare types */
/// <reference path="../../../worker-configuration.d.ts" />
import { CSP_VALUE, HSTS_VALUE, PERMISSIONS_POLICY_VALUE } from '$lib/constants/security'
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
	it('sets X-Content-Type-Options to nosniff', () => {
		const response = new Response()

		security.add_security_headers(response)

		expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
	})

	it('sets X-Frame-Options to SAMEORIGIN', () => {
		const response = new Response()

		security.add_security_headers(response)

		expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN')
	})

	it('sets Referrer-Policy to strict-origin-when-cross-origin', () => {
		const response = new Response()

		security.add_security_headers(response)

		expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
	})

	it('sets Strict-Transport-Security', () => {
		const response = new Response()

		security.add_security_headers(response)

		expect(response.headers.get('Strict-Transport-Security')).toBe(HSTS_VALUE)
	})

	it('sets Permissions-Policy', () => {
		const response = new Response()

		security.add_security_headers(response)

		expect(response.headers.get('Permissions-Policy')).toBe(PERMISSIONS_POLICY_VALUE)
	})

	it('sets Content-Security-Policy', () => {
		const response = new Response()

		security.add_security_headers(response)

		expect(response.headers.get('Content-Security-Policy')).toBe(CSP_VALUE)
	})
})

describe('security.add_security_headers — CSP directives', () => {
	it('includes required third-party script origins', () => {
		expect(CSP_VALUE).toContain('https://www.googletagmanager.com')
		expect(CSP_VALUE).toContain('https://*.googlesyndication.com')
	})

	it('includes Google Fonts origins', () => {
		expect(CSP_VALUE).toContain('https://fonts.googleapis.com')
		expect(CSP_VALUE).toContain('https://fonts.gstatic.com')
	})

	it('allows the YouTube embed origin in frame-src', () => {
		expect(CSP_VALUE).toContain('https://www.youtube-nocookie.com')
	})

	it('disables object-src', () => {
		expect(CSP_VALUE).toContain("object-src 'none'")
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
