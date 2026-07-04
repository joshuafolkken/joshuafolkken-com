import { afterEach, describe, expect, it, vi } from 'vitest'
import type { DocumentRecord } from './github-documentation'
import { github_documentation_ingest, type IngestDependencies } from './ingest-github-documentation'

const RECORDS: ReadonlyArray<DocumentRecord> = [
	{ key: 'github__a__README.md', content: 'a' },
	{ key: 'github__b__README.md', content: 'b' },
]

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

describe('github_documentation_ingest.run_ingest', () => {
	it('uploads every collected document and returns the count', async () => {
		const upload = vi.fn().mockResolvedValue(undefined)
		const dependencies: IngestDependencies = {
			collect: vi.fn().mockResolvedValue(RECORDS),
			upload,
		}

		const count = await github_documentation_ingest.run_ingest(
			dependencies,
			'joshuafolkken',
			undefined,
		)

		expect(count).toBe(2)
		expect(upload).toHaveBeenCalledTimes(2)
		expect(upload).toHaveBeenNthCalledWith(1, RECORDS[0])
	})
})
