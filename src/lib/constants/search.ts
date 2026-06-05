import type { SearchDocumentType } from '$lib/types/search'

const SEARCH_INDEX_URL = '/search-index.json'

const MIN_QUERY_LENGTH = 2
const MAX_RESULTS = 30

// User-visible strings are centralized here (the project has no i18n runtime yet;
// constants are the established pattern — see $lib/app.ts LINK_LABELS).
const SEARCH_LABELS = {
	TRIGGER: 'Search',
	OPEN: 'Open search',
	CLOSE: 'Close search',
	PLACEHOLDER: 'Search posts, projects, pages...',
	NO_RESULTS: 'No results found',
	LOADING: 'Loading search index...',
	HINT: 'Type at least two characters to search',
} as const

const SEARCH_GROUP_ORDER: ReadonlyArray<SearchDocumentType> = ['blog', 'project', 'page']

const SEARCH_GROUP_LABELS: Record<SearchDocumentType, string> = {
	blog: 'Blog',
	project: 'Projects',
	page: 'Pages',
}

export {
	MAX_RESULTS,
	MIN_QUERY_LENGTH,
	SEARCH_GROUP_LABELS,
	SEARCH_GROUP_ORDER,
	SEARCH_INDEX_URL,
	SEARCH_LABELS,
}
