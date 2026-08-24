import { MAX_RESULTS } from '$lib/constants/search'
import type { SearchDocument, SearchDocumentType, SearchResult } from '$lib/types/search'
import { search_tokenizer } from '$lib/utils/tokenize'
import MiniSearch, { type SearchOptions } from 'minisearch'

const SEARCH_FIELDS = ['title', 'excerpt', 'body']
const STORE_FIELDS = ['type', 'title', 'excerpt', 'url']

// Finding related articles asks a different question than the search box does. Its query is a
// whole article's title and excerpt, so the box's `AND` — every token must appear — matches
// nothing. `OR` ranks candidates by how much they share with that article instead, and prefix
// matching comes off because a bigram prefix match is noise once the query is hundreds of
// tokens long. Everything else (fields, tokenizer) stays shared with the box on purpose.
const SIMILARITY_OPTIONS: SearchOptions = { combineWith: 'OR', prefix: false }

function create_index(documents: Array<SearchDocument>): MiniSearch<SearchDocument> {
	const index = new MiniSearch<SearchDocument>({
		fields: SEARCH_FIELDS,
		storeFields: STORE_FIELDS,
		tokenize: search_tokenizer.tokenize,
		searchOptions: { tokenize: search_tokenizer.tokenize, combineWith: 'AND', prefix: true },
	})

	index.addAll(documents)

	return index
}

const DOCUMENT_TYPES: ReadonlyArray<SearchDocumentType> = ['blog', 'project', 'page']

function to_document_type(value: unknown): SearchDocumentType | undefined {
	return DOCUMENT_TYPES.find((type) => type === value)
}

function is_string(value: unknown): value is string {
	return typeof value === 'string'
}

function to_excerpt(value: unknown): string {
	return is_string(value) ? value : ''
}

function normalize_result(raw: Record<string, unknown>): SearchResult | undefined {
	const { type: raw_type, id, title, url, excerpt } = raw
	const type = to_document_type(raw_type)

	if (!type || !is_string(id) || !is_string(title) || !is_string(url)) {
		return undefined
	}

	return { id, type, title, excerpt: to_excerpt(excerpt), url }
}

function to_results(matches: Array<Record<string, unknown>>, limit: number): Array<SearchResult> {
	return matches
		.slice(0, limit)
		.map((match) => normalize_result(match))
		.filter((result): result is SearchResult => result !== undefined)
}

function run_search(index: MiniSearch<SearchDocument>, query: string): Array<SearchResult> {
	return to_results(index.search(query), MAX_RESULTS)
}

function run_similarity_search(
	index: MiniSearch<SearchDocument>,
	query: string,
	limit: number,
): Array<SearchResult> {
	return to_results(index.search(query, SIMILARITY_OPTIONS), limit)
}

const search_engine = {
	create_index,
	run_search,
	run_similarity_search,
}

export { search_engine }
