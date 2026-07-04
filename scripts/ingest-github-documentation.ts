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
import { ai_search_items, type ItemsConfig } from './ai-search-items'
import { github_documentation, type DocumentRecord } from './github-documentation'

const DEFAULT_INSTANCE = 'joshuafolkken-com-chat'

interface IngestConfig extends ItemsConfig {
	owner: string
	github_token: string | undefined
}

interface IngestDependencies {
	collect: (owner: string, token: string | undefined) => Promise<ReadonlyArray<DocumentRecord>>
	upload: (record: DocumentRecord) => Promise<void>
}

function require_environment(name: string): string {
	const value = process.env[name]

	if (value === undefined || value === '') throw new Error(`Missing required env: ${name}`)

	return value
}

function optional_environment(name: string, fallback: string): string {
	const value = process.env[name]

	return value === undefined || value === '' ? fallback : value
}

function read_environment(name: string): string | undefined {
	return process.env[name]
}

function read_config(): IngestConfig {
	return {
		account_id: require_environment('CLOUDFLARE_ACCOUNT_ID'),
		api_token: require_environment('CLOUDFLARE_API_TOKEN'),
		instance: optional_environment('AI_SEARCH_INSTANCE', DEFAULT_INSTANCE),
		owner: optional_environment('GITHUB_DOCS_OWNER', github_documentation.DEFAULT_OWNER),
		github_token: read_environment('GITHUB_TOKEN'),
	}
}

async function run_ingest(
	dependencies: IngestDependencies,
	owner: string,
	token: string | undefined,
): Promise<number> {
	const documents = await dependencies.collect(owner, token)

	for (const record of documents) {
		await dependencies.upload(record)
		console.info(`Uploaded ${record.key}`)
	}

	return documents.length
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
	}
}

async function main(): Promise<void> {
	const config = read_config()
	const count = await run_ingest(build_dependencies(config), config.owner, config.github_token)

	console.info(`Uploaded ${String(count)} document(s) to AI Search instance ${config.instance}`)
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
	require_environment,
	read_config,
	run_ingest,
	build_dependencies,
}

export type { IngestConfig, IngestDependencies }
export { github_documentation_ingest }
