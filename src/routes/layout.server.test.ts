/* eslint-disable unicorn/no-null -- OpenCollectiveMember interface uses MemberId (PascalCase) and null per API contract */
import { opencollective_api } from '$lib/api/opencollective-api'
import { kv_cache } from '$lib/server/kv-cache'
import type { OpenCollectiveMember } from '$lib/types/opencollective'
import { beforeEach, describe, expect, it, vi } from 'vitest'
// eslint-disable-next-line import/extensions
import { load } from './+layout.server'

vi.mock('$lib/server/kv-cache', () => ({
	kv_cache: { get: vi.fn() },
}))

vi.mock('$lib/api/opencollective-api', () => ({
	opencollective_api: { fetch_supporters: vi.fn() },
}))

vi.mock('$lib/logger', () => ({
	logger: { error: vi.fn() },
}))

const MOCK_SUPPORTERS: Array<OpenCollectiveMember> = [
	{
		MemberId: 1,
		name: 'Test Supporter',
		image: null,
		profile: 'https://opencollective.com/test',
		totalAmountDonated: 10,
		role: 'BACKER',
	},
]

function make_event(route_id = '/'): Parameters<typeof load>[0] {
	// @ts-expect-error — partial mock: only properties consumed by load() are provided
	return { fetch: vi.fn(), platform: undefined, route: { id: route_id } }
}

beforeEach(() => {
	vi.resetAllMocks()
})

describe('layout load', () => {
	it('returns supporters from kv_cache', async () => {
		vi.mocked(kv_cache.get).mockResolvedValue(MOCK_SUPPORTERS)

		const result = await load(make_event())

		expect(result).toStrictEqual({ supporters: MOCK_SUPPORTERS })
	})

	it('returns empty supporters when route.id is falsy', async () => {
		const result = await load(make_event(''))

		expect(result).toStrictEqual({ supporters: [] })
		expect(kv_cache.get).not.toHaveBeenCalled()
	})

	it('returns empty supporters when kv_cache throws', async () => {
		vi.mocked(kv_cache.get).mockRejectedValue(new Error('kv error'))

		const result = await load(make_event())

		expect(result).toStrictEqual({ supporters: [] })
	})

	it('fetcher calls opencollective_api.fetch_supporters with fetch', async () => {
		vi.mocked(opencollective_api.fetch_supporters).mockResolvedValue(MOCK_SUPPORTERS)
		vi.mocked(kv_cache.get).mockImplementation(async (_key, fetcher) => await fetcher())

		const event = make_event()

		await load(event)

		expect(opencollective_api.fetch_supporters).toHaveBeenCalledWith(event.fetch)
	})
})
