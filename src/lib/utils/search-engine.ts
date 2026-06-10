import { MAX_RESULTS } from '$lib/constants/search'
import type { SearchDocument, SearchDocumentType, SearchResult } from '$lib/types/search'
import { search_tokenizer } from '$lib/utils/tokenize'
import MiniSearch from 'minisearch'

const SEARCH_FIELDS = ['title', 'excerpt', 'body']
const STORE_FIELDS = ['type', 'title', 'excerpt', 'url']

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

function run_search(index: MiniSearch<SearchDocument>, query: string): Array<SearchResult> {
	return index
		.search(query)
		.slice(0, MAX_RESULTS)
		.map((result) => normalize_result(result))
		.filter((result): result is SearchResult => result !== undefined)
}

const search_engine = {
	create_index,
	run_search,
}

export { search_engine }
