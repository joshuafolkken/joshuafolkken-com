import { ERROR_MESSAGES, HTTP_STATUS } from '$lib/constants/http'
import { like_store } from '$lib/server/like-store'
import { security } from '$lib/server/security'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET, POST } from './+server'

vi.mock('$lib/server/like-store', () => ({
	like_store: { get: vi.fn(), increment: vi.fn() },
}))

vi.mock('$lib/server/security', () => ({
	security: {
		validate_request_security: vi.fn(),
		json_error: vi.fn((message: string, status: number) =>
			Response.json({ error: message }, { status }),
		),
	},
}))

vi.mock('$lib/logger', () => ({
	logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}))

const VALID_SLUG = 'test-post'
const INVALID_SLUG = 'INVALID SLUG!'
const LIKE_COUNT = 42
const DB_ERROR = 'DB error'
const SECURITY_REJECTION_TEST = 'propagates security rejection response'
const JSON_CONTENT_TYPE = 'application/json'
const LIKE_API_URL = 'http://localhost/api/like'

function make_get_event(slug?: string): Parameters<typeof GET>[0] {
	const query = slug === undefined ? '' : `?slug=${slug}`
	const url = new URL(`${LIKE_API_URL}${query}`)

	const partial = {
		url,
		request: new Request(url.toString()),
		getClientAddress: () => '127.0.0.1',
		platform: undefined,
	}

	return partial as Parameters<typeof GET>[0]
}

function make_post_event(
	body: Record<string, unknown>,
	content_type = JSON_CONTENT_TYPE,
): Parameters<typeof POST>[0] {
	const url = new URL(LIKE_API_URL)
	const request = new Request(url.toString(), {
		method: 'POST',
		headers: { 'content-type': content_type },
		body: JSON.stringify(body),
	})

	const partial = {
		url,
		request,
		getClientAddress: () => '127.0.0.1',
		platform: undefined,
	}

	return partial as Parameters<typeof POST>[0]
}

function make_post_event_raw_body(
	raw_body: string,
	content_type = JSON_CONTENT_TYPE,
): Parameters<typeof POST>[0] {
	const url = new URL(LIKE_API_URL)
	const request = new Request(url.toString(), {
		method: 'POST',
		headers: { 'content-type': content_type },
		body: raw_body,
	})

	const partial = {
		url,
		request,
		getClientAddress: () => '127.0.0.1',
		platform: undefined,
	}

	return partial as Parameters<typeof POST>[0]
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('GET /api/like', () => {
	beforeEach(() => {
		vi.mocked(security.validate_request_security).mockReset()
		vi.mocked(like_store.get).mockResolvedValue(LIKE_COUNT)
	})

	it('returns like count for a valid slug', async () => {
		const response = await GET(make_get_event(VALID_SLUG))
		const data = await response.json()

		expect(response.status).toBe(HTTP_STATUS.OK)
		expect(data).toEqual({ likes: LIKE_COUNT })
	})

	it('returns 400 SLUG_REQUIRED when slug is missing', async () => {
		const response = await GET(make_get_event())
		const data = await response.json()

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
		expect(data).toMatchObject({ error: ERROR_MESSAGES.SLUG_REQUIRED })
	})

	it('returns 400 SLUG_INVALID when slug fails validation', async () => {
		const response = await GET(make_get_event(INVALID_SLUG))
		const data = await response.json()

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
		expect(data).toMatchObject({ error: ERROR_MESSAGES.SLUG_INVALID })
	})

	it(SECURITY_REJECTION_TEST, async () => {
		const security_error = new Response(undefined, { status: HTTP_STATUS.TOO_MANY_REQUESTS })

		vi.mocked(security.validate_request_security).mockResolvedValue(security_error)

		const response = await GET(make_get_event(VALID_SLUG))

		expect(response.status).toBe(HTTP_STATUS.TOO_MANY_REQUESTS)
	})

	it('returns 500 when like_store.get throws', async () => {
		vi.mocked(like_store.get).mockRejectedValue(new Error(DB_ERROR))

		const response = await GET(make_get_event(VALID_SLUG))

		expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
	})
})

describe('POST /api/like — validation', () => {
	beforeEach(() => {
		vi.mocked(security.validate_request_security).mockReset()
		vi.mocked(like_store.increment).mockResolvedValue(LIKE_COUNT)
	})

	it('returns updated like count for a valid request', async () => {
		const response = await POST(make_post_event({ slug: VALID_SLUG }))
		const data = await response.json()

		expect(response.status).toBe(HTTP_STATUS.OK)
		expect(data).toEqual({ likes: LIKE_COUNT })
	})

	it('returns 400 INVALID_CONTENT_TYPE when Content-Type is not JSON', async () => {
		const response = await POST(make_post_event({ slug: VALID_SLUG }, 'text/plain'))
		const data = await response.json()

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
		expect(data).toMatchObject({ error: ERROR_MESSAGES.INVALID_CONTENT_TYPE })
	})

	it('returns 400 SLUG_INVALID when body slug is invalid', async () => {
		const response = await POST(make_post_event({ slug: INVALID_SLUG }))
		const data = await response.json()

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
		expect(data).toMatchObject({ error: ERROR_MESSAGES.SLUG_INVALID })
	})

	it('returns 400 SLUG_INVALID when body is a non-object JSON value', async () => {
		const response = await POST(make_post_event_raw_body('42'))
		const data = await response.json()

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
		expect(data).toMatchObject({ error: ERROR_MESSAGES.SLUG_INVALID })
	})
})

describe('POST /api/like — error handling', () => {
	beforeEach(() => {
		vi.mocked(security.validate_request_security).mockReset()
		vi.mocked(like_store.increment).mockResolvedValue(LIKE_COUNT)
	})

	it(SECURITY_REJECTION_TEST, async () => {
		const security_error = new Response(undefined, { status: HTTP_STATUS.FORBIDDEN })

		vi.mocked(security.validate_request_security).mockResolvedValue(security_error)

		const response = await POST(make_post_event({ slug: VALID_SLUG }))

		expect(response.status).toBe(HTTP_STATUS.FORBIDDEN)
	})

	it('returns 500 when like_store.increment throws', async () => {
		vi.mocked(like_store.increment).mockRejectedValue(new Error(DB_ERROR))

		const response = await POST(make_post_event({ slug: VALID_SLUG }))

		expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
	})
})
