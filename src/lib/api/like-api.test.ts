import { afterEach, describe, expect, it, vi } from 'vitest'
import { like_api } from './like-api'

vi.mock('$lib/app', () => ({
	APP: { ID: 'test-app' },
}))

const MOCK_LIKES = 42
const VALID_SLUG = 'test-post'
const INVALID_RESPONSE_FORMAT = 'Invalid response format'
const THROWS_ON_NON_OK = 'throws when response is not ok'

function make_json_response(data: unknown, status = 200): Response {
	return Response.json(data, { status })
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('like_api.get', () => {
	it('returns like count on successful response', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(make_json_response({ likes: MOCK_LIKES })))
		const result = await like_api.get(VALID_SLUG)

		expect(result).toEqual({ likes: MOCK_LIKES })
	})

	it(THROWS_ON_NON_OK, async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(make_json_response({}, 400)))

		await expect(like_api.get(VALID_SLUG)).rejects.toThrow()
	})

	it('throws when response has no likes property', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(make_json_response({ count: 42 })))

		await expect(like_api.get(VALID_SLUG)).rejects.toThrow(INVALID_RESPONSE_FORMAT)
	})

	it('throws when likes is not a number', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(make_json_response({ likes: '42' })))

		await expect(like_api.get(VALID_SLUG)).rejects.toThrow(INVALID_RESPONSE_FORMAT)
	})
})

describe('like_api.increment', () => {
	it('returns updated like count on successful response', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(make_json_response({ likes: MOCK_LIKES })))
		const result = await like_api.increment(VALID_SLUG)

		expect(result).toEqual({ likes: MOCK_LIKES })
	})

	it(THROWS_ON_NON_OK, async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(make_json_response({}, 500)))

		await expect(like_api.increment(VALID_SLUG)).rejects.toThrow()
	})
})
