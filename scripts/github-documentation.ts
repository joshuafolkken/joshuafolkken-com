#!/usr/bin/env tsx
/**
 * Collect public GitHub repository documentation (README + docs/**.md + prompts/**.md,
 * excluding blog-drafts/) for the AI chat RAG index.
 *
 * Pure helpers here are unit-tested; network helpers are thin wrappers over fetch.
 */
import { github_url } from './github-url'

const GITHUB_API = 'https://api.github.com'
const GITHUB_HOST = 'https://github.com'
const DEFAULT_OWNER = 'joshuafolkken'
const REPOS_PER_PAGE = 100
const GITHUB_API_VERSION = '2022-11-28'
const DOCUMENT_PATH_PATTERN = /^(readme\.md|(docs|prompts)\/.+\.md)$/iu
// Unpublished blog drafts are not documentation — the repo itself excludes them (cspell ignorePaths).
const EXCLUDED_PATH_PATTERN = /blog-drafts\//iu

interface GithubRepo {
	name: string
	default_branch: string
	description?: string | null
	topics?: ReadonlyArray<string>
	fork: boolean
}

interface DocumentRecord {
	key: string
	content: string
}

interface GithubTreeEntry {
	path: string
	type: string
}

interface GithubTree {
	tree: ReadonlyArray<GithubTreeEntry>
	truncated?: boolean
}

function github_headers(token: string | undefined): Record<string, string> {
	const base: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'User-Agent': DEFAULT_OWNER,
		'X-GitHub-Api-Version': GITHUB_API_VERSION,
	}

	if (token === undefined || token === '') return base

	return { ...base, Authorization: `Bearer ${token}` }
}

function build_repos_url(owner: string): string {
	const query = `per_page=${String(REPOS_PER_PAGE)}&type=owner&sort=updated`

	return `${GITHUB_API}/users/${owner}/repos?${query}`
}

function build_tree_url(owner: string, repo: string, branch: string): string {
	const reference = encodeURIComponent(branch)

	return `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${reference}?recursive=1`
}

function build_raw_url(owner: string, repo: string, branch: string, path: string): string {
	return `${github_url.RAW_HOST}/${owner}/${repo}/${branch}/${github_url.encode_url_path(path)}`
}

function build_source_url(owner: string, repo: string, branch: string, path: string): string {
	return `${GITHUB_HOST}/${owner}/${repo}/blob/${branch}/${github_url.encode_url_path(path)}`
}

function is_ingestable_repo(repo: GithubRepo): boolean {
	return !repo.fork
}

function is_document_path(path: string): boolean {
	if (EXCLUDED_PATH_PATTERN.test(path)) return false

	return DOCUMENT_PATH_PATTERN.test(path)
}

function build_document_key(repo_name: string, path: string): string {
	const flattened = path.replaceAll('/', '__')

	return `github__${repo_name}__${flattened}`
}

function format_topics(topics: ReadonlyArray<string> | undefined): string {
	return topics !== undefined && topics.length > 0 ? topics.join(', ') : 'none'
}

function build_document_content(
	owner: string,
	repo: GithubRepo,
	path: string,
	markdown: string,
): string {
	const source = build_source_url(owner, repo.name, repo.default_branch, path)
	const header = [
		`# ${repo.name} — ${path}`,
		'',
		`Repository: ${repo.name}`,
		`Description: ${repo.description ?? 'none'}`,
		`Topics: ${format_topics(repo.topics)}`,
		`Source: ${source}`,
		'',
		'---',
		'',
	].join('\n')

	return `${header}${markdown}`
}

function warn_if_repos_truncated(count: number): void {
	if (count < REPOS_PER_PAGE) return

	console.warn(
		`Fetched ${String(count)} repos (page limit ${String(REPOS_PER_PAGE)}); further pages are not ingested.`,
	)
}

function warn_if_tree_truncated(repo_name: string, is_truncated: boolean | undefined): void {
	if (is_truncated !== true) return

	console.warn(`Tree truncated for ${repo_name}; some docs may be missing.`)
}

async function fetch_json<T>(url: string, token: string | undefined): Promise<T> {
	const response = await fetch(url, { headers: github_headers(token) })

	if (!response.ok) throw new Error(`GitHub request failed (${String(response.status)}): ${url}`)

	const data: unknown = await response.json()

	return data as T
}

async function fetch_raw(
	owner: string,
	repo: string,
	branch: string,
	path: string,
): Promise<string> {
	const response = await fetch(build_raw_url(owner, repo, branch, path))

	if (!response.ok) throw new Error(`Raw fetch failed (${String(response.status)}): ${path}`)

	return await response.text()
}

async function fetch_repos(
	owner: string,
	token: string | undefined,
): Promise<ReadonlyArray<GithubRepo>> {
	return await fetch_json<ReadonlyArray<GithubRepo>>(build_repos_url(owner), token)
}

async function fetch_document_paths(
	owner: string,
	repo: GithubRepo,
	token: string | undefined,
): Promise<ReadonlyArray<string>> {
	const url = build_tree_url(owner, repo.name, repo.default_branch)
	const { tree, truncated: is_truncated } = await fetch_json<GithubTree>(url, token)

	warn_if_tree_truncated(repo.name, is_truncated)

	return tree
		.filter((entry) => entry.type === 'blob' && is_document_path(entry.path))
		.map((entry) => entry.path)
}

async function build_record(
	owner: string,
	repo: GithubRepo,
	path: string,
): Promise<DocumentRecord> {
	const markdown = await fetch_raw(owner, repo.name, repo.default_branch, path)

	return {
		key: build_document_key(repo.name, path),
		content: build_document_content(owner, repo, path, markdown),
	}
}

async function collect_repo_documents(
	owner: string,
	repo: GithubRepo,
	token: string | undefined,
): Promise<ReadonlyArray<DocumentRecord>> {
	try {
		const paths = await fetch_document_paths(owner, repo, token)

		return await Promise.all(paths.map(async (path) => await build_record(owner, repo, path)))
	} catch (error) {
		console.warn(`Skipped ${repo.name}: ${String(error)}`)

		return []
	}
}

async function collect_all_documents(
	owner: string,
	token: string | undefined,
): Promise<ReadonlyArray<DocumentRecord>> {
	const repos = await fetch_repos(owner, token)

	warn_if_repos_truncated(repos.length)

	const collected: Array<DocumentRecord> = []

	for (const repo of repos) {
		if (!is_ingestable_repo(repo)) continue

		const documents = await collect_repo_documents(owner, repo, token)

		collected.push(...documents)
	}

	return collected
}

const github_documentation = {
	DEFAULT_OWNER,
	build_repos_url,
	build_tree_url,
	build_raw_url,
	build_source_url,
	build_document_key,
	build_document_content,
	format_topics,
	github_headers,
	is_document_path,
	is_ingestable_repo,
	collect_all_documents,
}

export type { GithubRepo, DocumentRecord }
export { github_documentation }
