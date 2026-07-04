import { describe, expect, it } from 'vitest'
import { github_documentation, type DocumentRecord, type GithubRepo } from './github-documentation'

const OWNER = 'joshuafolkken'
const REPO = 'my-repo'
const BRANCH = 'main'
const DOCUMENT_PATH = 'docs/guide.md'
const BODY = '# Guide\n\nBody text.'
const README_KEY = 'github__my-repo__README.md'

const SAMPLE_REPO: GithubRepo = {
	name: REPO,
	default_branch: BRANCH,
	description: 'A sample repository',
	topics: ['svelte', 'typescript'],
	fork: false,
}

describe('github_documentation.build_repos_url', () => {
	it('builds the owner repos endpoint with pagination and owner filter', () => {
		expect(github_documentation.build_repos_url(OWNER)).toBe(
			'https://api.github.com/users/joshuafolkken/repos?per_page=100&type=owner&sort=updated',
		)
	})
})

describe('github_documentation.build_tree_url', () => {
	it('builds a recursive git tree endpoint for the branch', () => {
		expect(github_documentation.build_tree_url(OWNER, REPO, BRANCH)).toBe(
			'https://api.github.com/repos/joshuafolkken/my-repo/git/trees/main?recursive=1',
		)
	})
})

describe('github_documentation.build_raw_url', () => {
	it('builds a raw content URL', () => {
		expect(github_documentation.build_raw_url(OWNER, REPO, BRANCH, DOCUMENT_PATH)).toBe(
			'https://raw.githubusercontent.com/joshuafolkken/my-repo/main/docs/guide.md',
		)
	})

	it('encodes special characters per path segment', () => {
		const url = github_documentation.build_raw_url('o', 'r', BRANCH, 'docs/with space.md')

		expect(url).toContain('docs/with%20space.md')
	})
})

describe('github_documentation.is_document_path', () => {
	it('matches the root README', () => {
		expect(github_documentation.is_document_path('README.md')).toBe(true)
	})

	it('matches nested markdown under docs/', () => {
		expect(github_documentation.is_document_path('docs/guide/setup.md')).toBe(true)
	})

	it('matches markdown under prompts/', () => {
		expect(github_documentation.is_document_path('prompts/refactoring.md')).toBe(true)
		expect(github_documentation.is_document_path('prompts/nested/rules.md')).toBe(true)
	})

	it('excludes unpublished blog drafts', () => {
		expect(github_documentation.is_document_path('prompts/blog-drafts/kit.md')).toBe(false)
		expect(
			github_documentation.is_document_path('prompts/blog-drafts/gemini-pro-3/to-pnpm-mixed.md'),
		).toBe(false)
	})

	it('rejects source files and non-markdown documents', () => {
		expect(github_documentation.is_document_path('src/index.ts')).toBe(false)
		expect(github_documentation.is_document_path('docs/diagram.png')).toBe(false)
		expect(github_documentation.is_document_path('CONTRIBUTING.md')).toBe(false)
	})
})

describe('github_documentation.is_ingestable_repo', () => {
	it('accepts own repositories', () => {
		expect(github_documentation.is_ingestable_repo(SAMPLE_REPO)).toBe(true)
	})

	it('rejects forks', () => {
		expect(github_documentation.is_ingestable_repo({ ...SAMPLE_REPO, fork: true })).toBe(false)
	})
})

describe('github_documentation.build_document_key', () => {
	it('flattens path separators and keeps the markdown extension', () => {
		expect(github_documentation.build_document_key(REPO, DOCUMENT_PATH)).toBe(
			'github__my-repo__docs__guide.md',
		)
	})

	it('keeps a root README as a flat key', () => {
		expect(github_documentation.build_document_key(REPO, 'README.md')).toBe(README_KEY)
	})
})

describe('github_documentation.collect_fulfilled', () => {
	it('keeps fulfilled documents and drops rejected ones', () => {
		const record: DocumentRecord = { key: README_KEY, content: 'ok' }
		const settled: ReadonlyArray<PromiseSettledResult<DocumentRecord>> = [
			{ status: 'fulfilled', value: record },
			{ status: 'rejected', reason: new Error('boom') },
		]

		expect(github_documentation.collect_fulfilled(REPO, settled)).toEqual([record])
	})
})

describe('github_documentation.format_topics', () => {
	it('joins topics with commas', () => {
		expect(github_documentation.format_topics(['a', 'b'])).toBe('a, b')
	})

	it('returns none when there are no topics', () => {
		expect(github_documentation.format_topics([])).toBe('none')
		expect(github_documentation.format_topics(undefined)).toBe('none')
	})
})

describe('github_documentation.build_document_content', () => {
	it('prepends a metadata header before the markdown body', () => {
		const content = github_documentation.build_document_content(
			OWNER,
			SAMPLE_REPO,
			DOCUMENT_PATH,
			BODY,
		)

		expect(content).toContain('# my-repo — docs/guide.md')
		expect(content).toContain('Description: A sample repository')
		expect(content).toContain('Topics: svelte, typescript')
		expect(content).toContain(
			'Source: https://github.com/joshuafolkken/my-repo/blob/main/docs/guide.md',
		)
		expect(content).toContain(BODY)
	})

	it('falls back to none for a missing description', () => {
		const without_description: GithubRepo = {
			name: REPO,
			default_branch: BRANCH,
			fork: false,
		}
		const content = github_documentation.build_document_content(
			OWNER,
			without_description,
			'README.md',
			'body',
		)

		expect(content).toContain('Description: none')
	})
})

describe('github_documentation.github_headers', () => {
	it('always sets the API version and a user agent', () => {
		const headers = github_documentation.github_headers(undefined)

		expect(headers).toMatchObject({
			Accept: 'application/vnd.github+json',
			'User-Agent': 'joshuafolkken',
		})
		expect(headers).not.toHaveProperty('Authorization')
	})

	it('adds a bearer token when provided', () => {
		expect(github_documentation.github_headers('secret')).toMatchObject({
			Authorization: 'Bearer secret',
		})
	})
})
