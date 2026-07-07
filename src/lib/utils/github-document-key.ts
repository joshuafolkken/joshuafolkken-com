// The RAG ingestion pipeline flattens a repository doc path (docs/guide.md) into a single opaque index
// key (github__<repo>__docs__guide.md) so a document is addressable by one string. The chat renderer
// needs the exact inverse to turn a cited key back into a real GitHub URL, so the github__/__ convention
// and both directions live here — one home, so ingestion and rendering can never drift apart.

const KEY_PREFIX = 'github__'
const PATH_SEPARATOR = '__'
const GITHUB_HOST = 'https://github.com'
const DEFAULT_OWNER = 'joshuafolkken'
// The flattened key does not encode the source branch; ingestion labels each document with its repo's
// real default_branch (the accurate Source: URL), so main is a best-effort fallback for the renderer.
const DEFAULT_BRANCH = 'main'

interface ParsedDocumentKey {
	repo: string
	path: string
}

function build_key(repo_name: string, path: string): string {
	const flattened = path.split('/').join(PATH_SEPARATOR)

	return `${KEY_PREFIX}${repo_name}${PATH_SEPARATOR}${flattened}`
}

// Inverse of build_key. The flatten is lossy (a path segment literally containing '__' is
// indistinguishable from a separator); that edge case is accepted. Returns undefined for anything that
// is not a well-formed key, so callers can leave non-citation links untouched.
function parse_key(key: string): ParsedDocumentKey | undefined {
	if (!key.startsWith(KEY_PREFIX)) return undefined

	const [repo, ...segments] = key.slice(KEY_PREFIX.length).split(PATH_SEPARATOR)
	if (repo === undefined || repo === '' || segments.length === 0) return undefined

	return { repo, path: segments.join('/') }
}

function to_github_url(parsed: ParsedDocumentKey): string {
	return `${GITHUB_HOST}/${DEFAULT_OWNER}/${parsed.repo}/blob/${DEFAULT_BRANCH}/${parsed.path}`
}

function to_display_text(parsed: ParsedDocumentKey): string {
	return `${parsed.repo}/${parsed.path}`
}

const github_document_key = { build_key, parse_key, to_github_url, to_display_text }

export type { ParsedDocumentKey }
export { github_document_key }
