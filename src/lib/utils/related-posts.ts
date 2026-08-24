import type { SearchDocument } from '$lib/types/search'
import { search_engine } from '$lib/utils/search-engine'
import type MiniSearch from 'minisearch'

const RELATED_POSTS_LIMIT = 3

interface RelatedSource {
	index: MiniSearch<SearchDocument>
	documents: ReadonlyArray<SearchDocument>
}

// The article the reader is on: `id` is excluded from its own related list, and `text` is what
// the candidates are ranked against. They are separate because a post can be asked about
// without being a candidate itself — a post too short to index still gets a related list.
interface RelatedQuery {
	id: string
	text: string
}

function build_source(documents: Array<SearchDocument>): RelatedSource {
	return { index: search_engine.create_index(documents), documents }
}

// Documents arrive newest first, so a query that shares no tokens with anything — a very short
// post, or one on a subject nothing else covers — still ends with somewhere to go instead of an
// empty section.
function fill_from_order(
	selected: Array<string>,
	source: RelatedSource,
	exclude_id: string,
): Array<string> {
	const excluded = new Set([...selected, exclude_id])
	const remaining = source.documents
		.filter((document_) => !excluded.has(document_.id))
		.map((document_) => document_.id)

	return [...selected, ...remaining]
}

// One extra candidate is requested because an indexed post always matches itself first; dropping
// it then leaves exactly `limit` genuine matches.
function select(
	source: RelatedSource,
	query: RelatedQuery,
	limit: number = RELATED_POSTS_LIMIT,
): Array<string> {
	const matched = search_engine
		.run_similarity_search(source.index, query.text, limit + 1)
		.map((result) => result.id)
		.filter((id) => id !== query.id)
		.slice(0, limit)

	return fill_from_order(matched, source, query.id).slice(0, limit)
}

const related_posts = {
	build_source,
	select,
}

export { RELATED_POSTS_LIMIT, related_posts, type RelatedQuery, type RelatedSource }
