#!/usr/bin/env tsx
/**
 * Ingest public GitHub repository documentation (README + docs/**.md + prompts/**.md)
 * into the AI Search built-in storage.
 *
 * Usage:
 *   pnpm ingest:github-docs
 *
 * Required env (see .env.example):
 *   CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN
 * Optional env:
 *   AI_SEARCH_INSTANCE (default joshuafolkken-com-chat)
 *   GITHUB_DOCS_OWNER  (default joshuafolkken)
 *   GITHUB_TOKEN       (raises GitHub API rate limits)
 */
import { github_document_key } from '$lib/utils/github-document-key'
import { ai_search_items, type ItemsConfig, type StoredItem } from './ai-search-items'
import { environment } from './environment'
import { github_documentation, type DocumentRecord } from './github-documentation'

const DEFAULT_INSTANCE = 'joshuafolkken-com-chat'

interface IngestConfig extends ItemsConfig {
	owner: string
	github_token: string | undefined
}

interface IngestSummary {
	uploaded: number
	pruned: number
}

interface IngestDependencies {
	collect: (owner: string, token: string | undefined) => Promise<ReadonlyArray<DocumentRecord>>
	upload: (record: DocumentRecord) => Promise<void>
	list: () => Promise<ReadonlyArray<StoredItem>>
	remove: (id: string) => Promise<void>
}

function read_config(): IngestConfig {
	return {
		account_id: environment.require_environment('CLOUDFLARE_ACCOUNT_ID'),
		api_token: environment.require_environment('CLOUDFLARE_API_TOKEN'),
		instance: environment.optional_environment('AI_SEARCH_INSTANCE', DEFAULT_INSTANCE),
		owner: environment.optional_environment(
			'GITHUB_DOCS_OWNER',
			github_documentation.DEFAULT_OWNER,
		),
		github_token: environment.read_environment('GITHUB_TOKEN'),
	}
}

// Reconcile: an item is stale when it belongs to the GitHub namespace but its key is absent from the
// freshly collected set (its source doc was removed, renamed, or newly excluded). Non-github items are
// left untouched even if they appear in built-in storage.
function select_stale_items(
	existing: ReadonlyArray<StoredItem>,
	fresh_keys: ReadonlySet<string>,
): ReadonlyArray<StoredItem> {
	return existing.filter(
		(item) => github_document_key.is_github_key(item.key) && !fresh_keys.has(item.key),
	)
}

async function upload_documents(
	dependencies: IngestDependencies,
	documents: ReadonlyArray<DocumentRecord>,
): Promise<void> {
	for (const record of documents) {
		await dependencies.upload(record)
		console.info(`Uploaded ${record.key}`)
	}
}

async function prune_stale_items(
	dependencies: IngestDependencies,
	documents: ReadonlyArray<DocumentRecord>,
): Promise<number> {
	// A total collection failure yields an empty set; reconciling against it would delete every existing
	// item. Never prune against nothing — leave the index untouched and let a healthy run recover.
	if (documents.length === 0) {
		console.warn('Collected no documents; skipping prune to avoid deleting the entire index.')

		return 0
	}

	const fresh_keys = new Set(documents.map((record) => record.key))
	const stale = select_stale_items(await dependencies.list(), fresh_keys)

	for (const item of stale) {
		await dependencies.remove(item.id)
		console.info(`Pruned ${item.key}`)
	}

	return stale.length
}

async function run_ingest(
	dependencies: IngestDependencies,
	owner: string,
	token: string | undefined,
): Promise<IngestSummary> {
	const documents = await dependencies.collect(owner, token)

	// Upload first so a partial upload failure never leaves the index short a current document.
	await upload_documents(dependencies, documents)
	const pruned = await prune_stale_items(dependencies, documents)

	return { uploaded: documents.length, pruned }
}

function build_dependencies(config: IngestConfig): IngestDependencies {
	return {
		async collect(
			owner: string,
			token: string | undefined,
		): Promise<ReadonlyArray<DocumentRecord>> {
			return await github_documentation.collect_all_documents(owner, token)
		},
		async upload(record: DocumentRecord): Promise<void> {
			await ai_search_items.upload_item(config, record)
		},
		async list(): Promise<ReadonlyArray<StoredItem>> {
			return await ai_search_items.list_items(config)
		},
		async remove(id: string): Promise<void> {
			await ai_search_items.delete_item(config, id)
		},
	}
}

async function main(): Promise<void> {
	const config = read_config()
	const summary = await run_ingest(build_dependencies(config), config.owner, config.github_token)

	console.info(
		`Uploaded ${String(summary.uploaded)} document(s) and pruned ${String(summary.pruned)} stale item(s) on AI Search instance ${config.instance}`,
	)
}

const is_main_module = import.meta.url === `file://${process.argv[1] ?? ''}`

if (is_main_module) {
	try {
		await main()
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

const github_documentation_ingest = {
	DEFAULT_INSTANCE,
	require_environment: environment.require_environment,
	read_config,
	select_stale_items,
	run_ingest,
	build_dependencies,
}

export type { IngestConfig, IngestDependencies, IngestSummary }
export { github_documentation_ingest }
