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

		expect(form.has('file')).toBe(true)
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
		expect(init.headers).toMatchObject({ Authorization: 'Bearer token-abc' })
		expect(init.body).toBeInstanceOf(FormData)
	})

	it('throws when the upload response is not ok', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

		await expect(ai_search_items.upload_item(CONFIG, RECORD)).rejects.toThrow('README.md')
	})
})
