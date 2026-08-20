const BLOG_PATH_PREFIX = '/blog/'

// Slugs that were published under one name and later renamed, or retired when two posts were
// merged into one. A talk post's slug is its broadcast date, so correcting a date (archive publish
// day -> JST broadcast day) retires a live URL; a merge retires the absorbed post's URL the same
// way. Either case leaves a live URL that must keep resolving.
const LEGACY_SLUG_MAP = new Map<string, string>([
	['simon', 'mnemecha'],
	['talk-2025-12-12', 'talk-2025-12-11'],
	// Merged into the like-button post, which now covers the whole TURSO -> Drizzle -> D1 arc (#837).
	['like-button-orm', 'like-button'],
])

function strip_trailing_slashes(value: string): string {
	let result = value

	while (result.endsWith('/')) {
		result = result.slice(0, -1)
	}

	return result
}

function extract_slug(pathname: string): string | undefined {
	if (!pathname.startsWith(BLOG_PATH_PREFIX)) return undefined

	const after_prefix = pathname.slice(BLOG_PATH_PREFIX.length)
	const without_trailing_slash = strip_trailing_slashes(after_prefix)

	if (without_trailing_slash.length === 0) return undefined
	if (without_trailing_slash.includes('/')) return undefined

	return without_trailing_slash
}

function get_redirect_target(pathname: string): string | undefined {
	const slug = extract_slug(pathname)
	if (slug === undefined) return undefined

	const new_slug = LEGACY_SLUG_MAP.get(slug)
	if (new_slug === undefined) return undefined

	return `${BLOG_PATH_PREFIX}${new_slug}`
}

export const blog_redirects = {
	get_redirect_target,
}
