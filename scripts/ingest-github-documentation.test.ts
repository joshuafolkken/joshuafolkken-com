import { afterEach, describe, expect, it, vi } from 'vitest'
import type { StoredItem } from './ai-search-items'
import type { DocumentRecord } from './github-documentation'
import { github_documentation_ingest, type IngestDependencies } from './ingest-github-documentation'

const KEY_A = 'github__a__README.md'
const STALE_ID = '2'
const STALE_KEY = 'github__old__docs__gone.md'
const SITE_KEY = 'site__page.md'

const RECORDS: ReadonlyArray<DocumentRecord> = [
	{ key: KEY_A, content: 'a' },
	{ key: 'github__b__README.md', content: 'b' },
]

const EXISTING_ITEMS: ReadonlyArray<StoredItem> = [
	{ id: '1', key: KEY_A },
	{ id: STALE_ID, key: STALE_KEY },
	{ id: '3', key: SITE_KEY },
]

interface IngestMocks {
	dependencies: IngestDependencies
	upload: ReturnType<typeof vi.fn>
	list: ReturnType<typeof vi.fn>
	remove: ReturnType<typeof vi.fn>
}

function build_ingest_mocks(
	existing: ReadonlyArray<StoredItem>,
	documents: ReadonlyArray<DocumentRecord> = RECORDS,
): IngestMocks {
	const upload = vi.fn().mockResolvedValue(undefined)
	const list = vi.fn().mockResolvedValue(existing)
	const remove = vi.fn().mockResolvedValue(undefined)
	const dependencies: IngestDependencies = {
		collect: vi.fn().mockResolvedValue(documents),
		upload,
		list,
		remove,
	}

	return { dependencies, upload, list, remove }
}

afterEach(() => {
	vi.unstubAllEnvs()
})

describe('github_documentation_ingest.require_environment', () => {
	it('returns the value when the variable is set', () => {
		vi.stubEnv('CLOUDFLARE_ACCOUNT_ID', 'acc-1')

		expect(github_documentation_ingest.require_environment('CLOUDFLARE_ACCOUNT_ID')).toBe('acc-1')
	})

	it('throws when the variable is missing', () => {
		vi.stubEnv('CLOUDFLARE_ACCOUNT_ID', '')

		expect(() => github_documentation_ingest.require_environment('CLOUDFLARE_ACCOUNT_ID')).toThrow(
			'Missing required env',
		)
	})
})

describe('github_documentation_ingest.read_config', () => {
	it('applies defaults for the optional instance and owner', () => {
		vi.stubEnv('CLOUDFLARE_ACCOUNT_ID', 'acc-1')
		vi.stubEnv('CLOUDFLARE_API_TOKEN', 'token-1')
		vi.stubEnv('AI_SEARCH_INSTANCE', '')
		vi.stubEnv('GITHUB_DOCS_OWNER', '')

		const config = github_documentation_ingest.read_config()

		expect(config.account_id).toBe('acc-1')
		expect(config.api_token).toBe('token-1')
		expect(config.instance).toBe(github_documentation_ingest.DEFAULT_INSTANCE)
		expect(config.owner).toBe('joshuafolkken')
	})
})

describe('github_documentation_ingest.select_stale_items', () => {
	it('selects github items whose key is absent from the fresh set', () => {
		const fresh = new Set(RECORDS.map((record) => record.key))

		expect(github_documentation_ingest.select_stale_items(EXISTING_ITEMS, fresh)).toEqual([
			{ id: STALE_ID, key: STALE_KEY },
		])
	})

	it('never selects non-github items even when absent from the fresh set', () => {
		const stale = github_documentation_ingest.select_stale_items(EXISTING_ITEMS, new Set())

		expect(stale).not.toContainEqual({ id: '3', key: SITE_KEY })
	})
})

describe('github_documentation_ingest.run_ingest', () => {
	it('uploads every collected document and returns the counts', async () => {
		const { dependencies, upload } = build_ingest_mocks([])

		const summary = await github_documentation_ingest.run_ingest(
			dependencies,
			'joshuafolkken',
			undefined,
		)

		expect(summary).toEqual({ uploaded: 2, pruned: 0 })
		expect(upload).toHaveBeenCalledTimes(2)
		expect(upload).toHaveBeenNthCalledWith(1, RECORDS[0])
	})

	it('prunes only stale github items and leaves current and non-github items', async () => {
		const { dependencies, remove } = build_ingest_mocks(EXISTING_ITEMS)

		const summary = await github_documentation_ingest.run_ingest(
			dependencies,
			'joshuafolkken',
			undefined,
		)

		expect(summary).toEqual({ uploaded: 2, pruned: 1 })
		expect(remove).toHaveBeenCalledTimes(1)
		expect(remove).toHaveBeenCalledWith(STALE_ID)
	})

	it('skips pruning entirely when collection yields no documents', async () => {
		const { dependencies, list, remove } = build_ingest_mocks(EXISTING_ITEMS, [])

		const summary = await github_documentation_ingest.run_ingest(
			dependencies,
			'joshuafolkken',
			undefined,
		)

		expect(summary).toEqual({ uploaded: 0, pruned: 0 })
		expect(list).not.toHaveBeenCalled()
		expect(remove).not.toHaveBeenCalled()
	})
})
