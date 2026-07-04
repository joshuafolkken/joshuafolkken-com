#!/usr/bin/env tsx
/**
 * Cloudflare AI Search Items REST client — uploads documents into an instance's built-in storage.
 *
 * See https://developers.cloudflare.com/ai-search/api/items/rest-api/
 */
import type { DocumentRecord } from './github-documentation'

const CLOUDFLARE_API = 'https://api.cloudflare.com/client/v4'
const MARKDOWN_MIME = 'text/markdown'

interface ItemsConfig {
	account_id: string
	api_token: string
	instance: string
}

function build_items_url(config: ItemsConfig): string {
	return `${CLOUDFLARE_API}/accounts/${config.account_id}/ai-search/instances/${config.instance}/items`
}

function build_form(record: DocumentRecord): FormData {
	const form = new FormData()

	form.append('file', new Blob([record.content], { type: MARKDOWN_MIME }), record.key)

	return form
}

async function upload_item(config: ItemsConfig, record: DocumentRecord): Promise<void> {
	const response = await fetch(build_items_url(config), {
		method: 'POST',
		headers: { Authorization: `Bearer ${config.api_token}` },
		body: build_form(record),
	})

	if (!response.ok) {
		throw new Error(`AI Search upload failed for ${record.key} (${String(response.status)})`)
	}
}

const ai_search_items = {
	build_items_url,
	build_form,
	upload_item,
}

export type { ItemsConfig }
export { ai_search_items }
