import { afterEach, describe, expect, it, vi } from 'vitest'
import { ai_search_items, type ItemsConfig } from './ai-search-items'
import type { DocumentRecord } from './github-documentation'

const CONFIG: ItemsConfig = {
	account_id: 'acc-123',
	api_token: 'token-abc',
	instance: 'joshuafolkken-com-chat',
}

const RECORD: DocumentRecord = {
	key: 'github__my-repo__README.md',
	content: '# Hello',
}

const BEARER_TOKEN = 'Bearer token-abc'
const KEY_A = 'github__a__README.md'
const KEY_B = 'github__b__README.md'
const ITEM_ID = 'item-1'

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('ai_search_items.build_items_url', () => {
	it('builds the items endpoint for the instance', () => {
		expect(ai_search_items.build_items_url(CONFIG)).toBe(
			'https://api.cloudflare.com/client/v4/accounts/acc-123/ai-search/instances/joshuafolkken-com-chat/items',
		)
	})
})

describe('ai_search_items.build_form', () => {
	it('attaches the content under the file field keyed by the item key', () => {
		const form = ai_search_items.build_form(RECORD)
		const file = form.get('file')

		expect(file).toBeInstanceOf(File)
		expect((file as File).name).toBe(RECORD.key)
		expect((file as File).type).toBe('text/markdown')
	})
})

describe('ai_search_items.upload_item', () => {
	it('posts multipart form data with a bearer token', async () => {
		const fetch_mock = vi.fn().mockResolvedValue({ ok: true, status: 200 })

		vi.stubGlobal('fetch', fetch_mock)

		await ai_search_items.upload_item(CONFIG, RECORD)

		const [url, init] = fetch_mock.mock.calls[0] as [string, RequestInit]

		expect(url).toBe(ai_search_items.build_items_url(CONFIG))
		expect(init.method).toBe('POST')
		expect(init.headers).toMatchObject({ Authorization: BEARER_TOKEN })
		expect(init.body).toBeInstanceOf(FormData)
	})

	it('throws when the upload response is not ok', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

		await expect(ai_search_items.upload_item(CONFIG, RECORD)).rejects.toThrow('README.md')
	})
})

describe('ai_search_items.build_list_url', () => {
	it('scopes the listing to the builtin source with pagination params', () => {
		expect(ai_search_items.build_list_url(CONFIG, 2)).toBe(
			`${ai_search_items.build_items_url(CONFIG)}?page=2&per_page=100&source=builtin`,
		)
	})
})

describe('ai_search_items.build_item_url', () => {
	it('appends the url-encoded item id', () => {
		expect(ai_search_items.build_item_url(CONFIG, 'a b/c')).toBe(
			`${ai_search_items.build_items_url(CONFIG)}/a%20b%2Fc`,
		)
	})
})

interface MockResponse {
	ok: boolean
	status: number
	json: () => Promise<unknown>
}

function list_response(
	result: ReadonlyArray<{ id: string; key: string }>,
	total_count: number,
): MockResponse {
	const body = { result, result_info: { total_count } }

	return {
		ok: true,
		status: 200,
		json: async (): Promise<unknown> => body,
	}
}

describe('ai_search_items.list_items', () => {
	it('aggregates every page until the total count is reached', async () => {
		const fetch_mock = vi
			.fn()
			.mockResolvedValueOnce(list_response([{ id: '1', key: KEY_A }], 2))
			.mockResolvedValueOnce(list_response([{ id: '2', key: KEY_B }], 2))

		vi.stubGlobal('fetch', fetch_mock)

		const items = await ai_search_items.list_items(CONFIG)

		expect(items).toEqual([
			{ id: '1', key: KEY_A },
			{ id: '2', key: KEY_B },
		])
		expect(fetch_mock).toHaveBeenCalledTimes(2)
		expect(fetch_mock.mock.calls[0]?.[0]).toBe(ai_search_items.build_list_url(CONFIG, 1))
		expect(fetch_mock.mock.calls[1]?.[0]).toBe(ai_search_items.build_list_url(CONFIG, 2))
	})

	it('stops when a page returns no items', async () => {
		const fetch_mock = vi.fn().mockResolvedValue(list_response([], 5))

		vi.stubGlobal('fetch', fetch_mock)

		expect(await ai_search_items.list_items(CONFIG)).toEqual([])
		expect(fetch_mock).toHaveBeenCalledTimes(1)
	})

	it('throws when the list response is not ok', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

		await expect(ai_search_items.list_items(CONFIG)).rejects.toThrow('list failed')
	})
})

describe('ai_search_items.delete_item', () => {
	it('sends a DELETE with a bearer token to the item url', async () => {
		const fetch_mock = vi.fn().mockResolvedValue({ ok: true, status: 200 })

		vi.stubGlobal('fetch', fetch_mock)

		await ai_search_items.delete_item(CONFIG, ITEM_ID)

		const [url, init] = fetch_mock.mock.calls[0] as [string, RequestInit]

		expect(url).toBe(ai_search_items.build_item_url(CONFIG, ITEM_ID))
		expect(init.method).toBe('DELETE')
		expect(init.headers).toMatchObject({ Authorization: BEARER_TOKEN })
	})

	it('throws when the delete response is not ok', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))

		await expect(ai_search_items.delete_item(CONFIG, ITEM_ID)).rejects.toThrow(ITEM_ID)
	})
})
