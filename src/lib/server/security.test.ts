import { RATE_LIMIT_COUNT } from '$lib/constants/security'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { security } from './security'

vi.mock('$lib/logger', () => ({
	logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

const APP_ID = 'joshuafolkken-com'
const BASE_URL = 'https://joshuafolkken.com/api/test'
const SAME_ORIGIN = 'https://joshuafolkken.com'
const DIFFERENT_ORIGIN = 'https://evil.example.com'
const LOCALHOST_ORIGIN = 'http://localhost:5173'
const INVALID_ORIGIN = 'not-a-url'

let ip_counter = 0

function unique_ip(): string {
	ip_counter += 1

	return `10.99.0.${String(ip_counter)}`
}

function make_request(options: { origin?: string; client?: string } = {}): Request {
	const headers = new Headers({ 'X-App-Client': APP_ID })

	if (options.origin !== undefined) headers.set('origin', options.origin)
	if (options.client !== undefined) headers.set('X-App-Client', options.client)

	return new Request(BASE_URL, { headers })
}

const APP_URL = new URL(BASE_URL)

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
	it('allows requests under the limit', () => {
		const ip = unique_ip()
		const result = security.validate_request_security(make_request(), APP_URL, ip)

		expect(result).toBeUndefined()
	})

	it('blocks the request after exceeding the rate limit', () => {
		const ip = unique_ip()
		const request = make_request()

		for (let index = 0; index < RATE_LIMIT_COUNT; index++) {
			security.validate_request_security(request, APP_URL, ip)
		}

		const result = security.validate_request_security(request, APP_URL, ip)

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(429)
	})
})

describe('security.validate_request_security — custom header', () => {
	it('returns undefined when the correct app client header is present', () => {
		const ip = unique_ip()
		const result = security.validate_request_security(make_request(), APP_URL, ip)

		expect(result).toBeUndefined()
	})

	it('returns 403 when the app client header is missing', () => {
		const ip = unique_ip()
		const result = security.validate_request_security(make_request({ client: '' }), APP_URL, ip)

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(403)
	})

	it('returns 403 when the app client header has an incorrect value', () => {
		const ip = unique_ip()
		const result = security.validate_request_security(
			make_request({ client: 'wrong-client' }),
			APP_URL,
			ip,
		)

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(403)
	})
})

describe('security.validate_request_security — origin (allowed)', () => {
	it('returns undefined when no origin header is present', () => {
		const ip = unique_ip()
		const result = security.validate_request_security(make_request(), APP_URL, ip)

		expect(result).toBeUndefined()
	})

	it('returns undefined when origin matches the request URL', () => {
		const ip = unique_ip()
		const result = security.validate_request_security(
			make_request({ origin: SAME_ORIGIN }),
			APP_URL,
			ip,
		)

		expect(result).toBeUndefined()
	})

	it('returns undefined when origin is localhost', () => {
		const ip = unique_ip()
		const result = security.validate_request_security(
			make_request({ origin: LOCALHOST_ORIGIN }),
			APP_URL,
			ip,
		)

		expect(result).toBeUndefined()
	})
})

describe('security.validate_request_security — origin (blocked)', () => {
	it('returns 403 when origin does not match the request URL', () => {
		const ip = unique_ip()
		const result = security.validate_request_security(
			make_request({ origin: DIFFERENT_ORIGIN }),
			APP_URL,
			ip,
		)

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(403)
	})

	it('returns 403 when origin is not a valid URL', () => {
		const ip = unique_ip()
		const result = security.validate_request_security(
			make_request({ origin: INVALID_ORIGIN }),
			APP_URL,
			ip,
		)

		expect(result).toBeInstanceOf(Response)
		expect(result?.status).toBe(403)
	})
})
