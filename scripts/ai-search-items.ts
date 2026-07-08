#!/usr/bin/env tsx
/**
 * Cloudflare AI Search Items REST client — uploads documents into an instance's built-in storage.
 *
 * See https://developers.cloudflare.com/ai-search/api/items/rest-api/
 */
import type { DocumentRecord } from './github-documentation'

const CLOUDFLARE_API = 'https://api.cloudflare.com/client/v4'
const MARKDOWN_MIME = 'text/markdown'
const ITEMS_PER_PAGE = 100
// Built-in storage holds the uploaded documents; the Web Crawl (site) source is a separate data source
// and must stay untouched, so listing is scoped to builtin.
const BUILTIN_SOURCE = 'builtin'

interface ItemsConfig {
	account_id: string
	api_token: string
	instance: string
}

interface StoredItem {
	id: string
	key: string
}

interface ResultInfo {
	total_count: number
}

interface ListResponse {
	result: ReadonlyArray<StoredItem>
	result_info: ResultInfo
}

function build_items_url(config: ItemsConfig): string {
	return `${CLOUDFLARE_API}/accounts/${config.account_id}/ai-search/instances/${config.instance}/items`
}

function build_list_url(config: ItemsConfig, page: number): string {
	const query = `page=${String(page)}&per_page=${String(ITEMS_PER_PAGE)}&source=${BUILTIN_SOURCE}`

	return `${build_items_url(config)}?${query}`
}

function build_item_url(config: ItemsConfig, id: string): string {
	return `${build_items_url(config)}/${encodeURIComponent(id)}`
}

function auth_headers(config: ItemsConfig): Record<string, string> {
	return { Authorization: `Bearer ${config.api_token}` }
}

function build_form(record: DocumentRecord): FormData {
	const form = new FormData()

	form.append('file', new Blob([record.content], { type: MARKDOWN_MIME }), record.key)

	return form
}

async function upload_item(config: ItemsConfig, record: DocumentRecord): Promise<void> {
	const response = await fetch(build_items_url(config), {
		method: 'POST',
		headers: auth_headers(config),
		body: build_form(record),
	})

	if (!response.ok) {
		throw new Error(`AI Search upload failed for ${record.key} (${String(response.status)})`)
	}
}

async function fetch_items_page(config: ItemsConfig, page: number): Promise<ListResponse> {
	const response = await fetch(build_list_url(config, page), { headers: auth_headers(config) })

	if (!response.ok) throw new Error(`AI Search list failed (${String(response.status)})`)

	const data: unknown = await response.json()

	return data as ListResponse
}

async function list_items(config: ItemsConfig): Promise<ReadonlyArray<StoredItem>> {
	const items: Array<StoredItem> = []
	let page = 1

	for (;;) {
		const { result, result_info } = await fetch_items_page(config, page)

		items.push(...result)
		if (result.length === 0 || items.length >= result_info.total_count) break
		page += 1
	}

	return items
}

async function delete_item(config: ItemsConfig, id: string): Promise<void> {
	const response = await fetch(build_item_url(config, id), {
		method: 'DELETE',
		headers: auth_headers(config),
	})

	if (!response.ok) {
		throw new Error(`AI Search delete failed for ${id} (${String(response.status)})`)
	}
}

const ai_search_items = {
	build_items_url,
	build_list_url,
	build_item_url,
	build_form,
	upload_item,
	list_items,
	delete_item,
}

export type { ItemsConfig, StoredItem }
export { ai_search_items }
