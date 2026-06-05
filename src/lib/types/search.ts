type SearchDocumentType = 'blog' | 'project' | 'page'

interface SearchDocument {
	id: string
	type: SearchDocumentType
	title: string
	excerpt: string
	body: string
	url: string
}

interface SearchResult {
	id: string
	type: SearchDocumentType
	title: string
	excerpt: string
	url: string
}

interface SearchGroup {
	type: SearchDocumentType
	results: Array<SearchResult>
}

export type { SearchDocument, SearchDocumentType, SearchGroup, SearchResult }
