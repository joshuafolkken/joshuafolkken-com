// The RAG ingestion pipeline flattens a repository doc path (docs/guide.md) into a single opaque index
// key (github__<repo>__docs__guide.md) so a document is addressable by one string. The chat renderer
// needs the exact inverse to turn a cited key back into a real GitHub URL, so the github__/__ convention
// and both directions live here — one home, so ingestion and rendering can never drift apart.

const KEY_PREFIX = 'github__'
const PATH_SEPARATOR = '__'
// A citation label the model built out of the flattened key. The match runs to the first character a key
// can never contain, so the ' — <repo>' suffix the model appends stays out of it, and it is anchored to
// the start of the label: a rewrite replaces the label wholesale, so prose that merely mentions a
// key-shaped token ('See github__kit__docs for the format') must not qualify.
const LEADING_KEY = new RegExp(String.raw`^${KEY_PREFIX}[\w.-]+`, 'u')
const GITHUB_HOST = 'https://github.com'
const DEFAULT_OWNER = 'joshuafolkken'
// The flattened key does not encode the source branch; ingestion labels each document with its repo's
// real default_branch (the accurate Source: URL), so main is a best-effort fallback for the renderer.
const DEFAULT_BRANCH = 'main'

interface ParsedDocumentKey {
	repo: string
	path: string
}

// Identifies keys that belong to the GitHub ingestion namespace, so the pruning reconcile can scope
// deletions to github-sourced items without re-hardcoding the prefix.
function is_github_key(key: string): boolean {
	return key.startsWith(KEY_PREFIX)
}

function build_key(repo_name: string, path: string): string {
	const flattened = path.split('/').join(PATH_SEPARATOR)

	return `${KEY_PREFIX}${repo_name}${PATH_SEPARATOR}${flattened}`
}

// Inverse of build_key. The flatten is lossy (a path segment literally containing '__' is
// indistinguishable from a separator); that edge case is accepted. Returns undefined for anything that
// is not a well-formed key, so callers can leave non-citation links untouched.
function parse_key(key: string): ParsedDocumentKey | undefined {
	if (!is_github_key(key)) return undefined

	const parts = key.slice(KEY_PREFIX.length).split(PATH_SEPARATOR)
	const [repo, ...segments] = parts
	if (repo === undefined || segments.length === 0) return undefined
	// Reject any empty part (e.g. a trailing separator), which would otherwise build a URL pointing at a
	// directory root rather than a document.
	if (parts.includes('')) return undefined

	return { repo, path: segments.join('/') }
}

// Finds a key the model wrote into a visible label rather than into an href — the whole label is the key
// ('github__<repo>__README.md'), optionally with the model's own ' — <repo>' suffix after it. Returns
// undefined for anything else, so a citation the model labelled correctly is left alone.
function parse_label_key(text: string): ParsedDocumentKey | undefined {
	const match = LEADING_KEY.exec(text.trim())
	if (!match) return undefined

	return parse_key(match[0])
}

function to_github_url(parsed: ParsedDocumentKey): string {
	return `${GITHUB_HOST}/${DEFAULT_OWNER}/${parsed.repo}/blob/${DEFAULT_BRANCH}/${parsed.path}`
}

// '<path> — <repo>' is the citation label the generation prompt mandates (docs/ai-search-generation-prompt.md);
// keeping the renderer's fallback on the same shape means a model-written and a rewritten citation read alike.
function to_display_text(parsed: ParsedDocumentKey): string {
	return `${parsed.path} — ${parsed.repo}`
}

const github_document_key = {
	is_github_key,
	build_key,
	parse_key,
	parse_label_key,
	to_github_url,
	to_display_text,
}

export type { ParsedDocumentKey }
export { github_document_key }
