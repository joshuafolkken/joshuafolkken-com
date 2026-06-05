import { browser } from '$app/environment'
import { MIN_QUERY_LENGTH, SEARCH_GROUP_ORDER, SEARCH_INDEX_URL } from '$lib/constants/search'
import type { SearchDocument, SearchGroup, SearchResult } from '$lib/types/search'
import { search_engine } from '$lib/utils/search-engine'
import type MiniSearch from 'minisearch'

async function fetch_documents(): Promise<Array<SearchDocument>> {
	const response = await fetch(SEARCH_INDEX_URL)
	if (!response.ok) throw new Error(`Failed to load search index: ${String(response.status)}`)

	const data: unknown = await response.json()

	return data as Array<SearchDocument>
}

function build_groups(items: Array<SearchResult>): Array<SearchGroup> {
	return SEARCH_GROUP_ORDER.map((type) => ({
		type,
		results: items.filter((item) => item.type === type),
	})).filter((group) => group.results.length > 0)
}

class SearchStateStore {
	#is_open = $state(false)
	#query = $state('')
	#is_loading = $state(false)
	#groups = $state<Array<SearchGroup>>([])
	#results = $state<Array<SearchResult>>([])
	#selected_index = $state(0)
	#index: MiniSearch<SearchDocument> | undefined
	#is_loaded = false

	get_is_open(): boolean {
		return this.#is_open
	}

	get_query(): string {
		return this.#query
	}

	get_is_loading(): boolean {
		return this.#is_loading
	}

	get_selected_index(): number {
		return this.#selected_index
	}

	get_result_count(): number {
		return this.#results.length
	}

	get_groups(): Array<SearchGroup> {
		return this.#groups
	}

	get_selected(): SearchResult | undefined {
		return this.#results[this.#selected_index]
	}

	open(): void {
		this.#is_open = true
		void this.#load()
	}

	close(): void {
		this.#is_open = false
	}

	set_query(value: string): void {
		this.#query = value
		this.#update_results()
	}

	move_selection(delta: number): void {
		const count = this.#results.length
		if (count === 0) return

		this.#selected_index = (this.#selected_index + delta + count) % count
	}

	#update_results(): void {
		const trimmed = this.#query.trim()

		if (!this.#index || trimmed.length < MIN_QUERY_LENGTH) {
			this.#set_results([])

			return
		}

		this.#set_results(search_engine.run_search(this.#index, trimmed))
	}

	#set_results(matches: Array<SearchResult>): void {
		this.#groups = build_groups(matches)
		this.#results = this.#groups.flatMap((group) => group.results)
		this.#selected_index = 0
	}

	async #load(): Promise<void> {
		if (this.#is_loaded || this.#is_loading || !browser) return

		this.#is_loading = true

		try {
			this.#index = search_engine.create_index(await fetch_documents())
			this.#is_loaded = true
			this.#update_results()
		} catch {
			// Leave #is_loaded false so a transient failure (offline / 404 / 500)
			// retries on the next open instead of sticking at an empty index.
		} finally {
			this.#is_loading = false
		}
	}
}

const search_state = new SearchStateStore()

export { search_state }
