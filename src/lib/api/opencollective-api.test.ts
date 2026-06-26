/* eslint-disable unicorn/no-null -- OpenCollective types use null in their API contract */
import type { GraphqlContributor } from '$lib/types/opencollective'
import { describe, expect, it, vi } from 'vitest'
import { opencollective_api } from './opencollective-api'

const INVALID_FORMAT_MSG = 'Invalid GraphQL response format'

vi.mock('$lib/app', () => ({
	OPENCOLLECTIVE: {
		SLUG: 'test-collective',
		URL: 'https://opencollective.com/test-collective',
	},
}))

const OPENCOLLECTIVE_BASE = 'https://opencollective.com'

function make_node(id: string, amount: number, slug: string, is_backer = true): GraphqlContributor {
	return {
		id,
		isBacker: is_backer,
		totalAmountContributed: { value: amount },
		account: { name: `User ${id}`, slug, imageUrl: null },
	}
}

function make_graphql_response(nodes: Array<GraphqlContributor>): unknown {
	return { data: { account: { contributors: { nodes } } } }
}

function make_fetch_function(data: unknown, is_ok = true): typeof globalThis.fetch {
	const status = is_ok ? 200 : 500

	return vi.fn().mockResolvedValue(Response.json(data, { status }))
}

describe('opencollective_api.fetch_supporters — success', () => {
	it('returns members sorted by totalAmountDonated descending', async () => {
		const nodes = [make_node('1', 50, 'user-a'), make_node('2', 100, 'user-b')]
		const result = await opencollective_api.fetch_supporters(
			make_fetch_function(make_graphql_response(nodes)),
		)

		expect(result).toHaveLength(2)
		expect(result[0]?.totalAmountDonated).toBe(100)
		expect(result[1]?.totalAmountDonated).toBe(50)
	})

	it('returns empty array when nodes is empty', async () => {
		const result = await opencollective_api.fetch_supporters(
			make_fetch_function(make_graphql_response([])),
		)

		expect(result).toEqual([])
	})

	it('maps contributor fields to OpenCollectiveMember shape', async () => {
		const nodes = [make_node('42', 200, 'some-backer')]
		const result = await opencollective_api.fetch_supporters(
			make_fetch_function(make_graphql_response(nodes)),
		)

		expect(result[0]).toEqual({
			MemberId: 42,
			name: 'User 42',
			image: null,
			profile: `${OPENCOLLECTIVE_BASE}/some-backer`,
			totalAmountDonated: 200,
			role: 'BACKER',
		})
	})
})

describe('opencollective_api.fetch_supporters — filtering', () => {
	it('excludes nodes where isBacker is false', async () => {
		const nodes = [make_node('1', 100, 'user-a'), make_node('2', 50, 'user-b', false)]
		const result = await opencollective_api.fetch_supporters(
			make_fetch_function(make_graphql_response(nodes)),
		)

		expect(result).toHaveLength(1)
		expect(result[0]?.MemberId).toBe(1)
	})

	it('excludes nodes with zero totalAmountContributed', async () => {
		const nodes = [make_node('1', 100, 'user-a'), make_node('2', 0, 'user-b')]
		const result = await opencollective_api.fetch_supporters(
			make_fetch_function(make_graphql_response(nodes)),
		)

		expect(result).toHaveLength(1)
		expect(result[0]?.MemberId).toBe(1)
	})

	it('excludes nodes with null account', async () => {
		const valid_node = make_node('1', 100, 'user-a')
		const null_account_node: GraphqlContributor = { ...make_node('2', 50, 'user-b'), account: null }
		const result = await opencollective_api.fetch_supporters(
			make_fetch_function(make_graphql_response([valid_node, null_account_node])),
		)

		expect(result).toHaveLength(1)
		expect(result[0]?.MemberId).toBe(1)
	})
})

describe('opencollective_api.fetch_supporters — error handling', () => {
	it('throws when HTTP response is not ok', async () => {
		await expect(
			opencollective_api.fetch_supporters(make_fetch_function({}, false)),
		).rejects.toThrow()
	})

	it('throws when GraphQL response contains errors', async () => {
		const error_response = { errors: [{ message: 'Not found' }] }

		await expect(
			opencollective_api.fetch_supporters(make_fetch_function(error_response)),
		).rejects.toThrow('Not found')
	})

	it('throws when GraphQL response is a string', async () => {
		await expect(
			opencollective_api.fetch_supporters(make_fetch_function('invalid')),
		).rejects.toThrow(INVALID_FORMAT_MSG)
	})

	it('throws when GraphQL response is an array', async () => {
		await expect(opencollective_api.fetch_supporters(make_fetch_function([]))).rejects.toThrow(
			INVALID_FORMAT_MSG,
		)
	})

	it('throws when GraphQL response is null', async () => {
		await expect(opencollective_api.fetch_supporters(make_fetch_function(null))).rejects.toThrow(
			INVALID_FORMAT_MSG,
		)
	})
})
