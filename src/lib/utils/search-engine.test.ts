import type { SearchDocument } from '$lib/types/search'
import { search_engine } from '$lib/utils/search-engine'
import { describe, expect, it } from 'vitest'

const BLOG_URL = '/blog/mnemecha'
const PROJECT_URL = '/projects/talk'

const DOCUMENTS: Array<SearchDocument> = [
	{
		id: BLOG_URL,
		type: 'blog',
		title: 'Mnemecha リリースの話',
		excerpt: 'シンプルな記憶ゲーム',
		body: '3D 空間に記憶ゲームを詰め込んでリリースしました',
		url: BLOG_URL,
	},
	{
		id: PROJECT_URL,
		type: 'project',
		title: 'Talk',
		excerpt: 'Language Learning Game',
		body: 'a fun language learning game for listening and speaking',
		url: PROJECT_URL,
	},
]

describe('search_engine', () => {
	it('finds a blog document by a space-less Japanese keyword', () => {
		const index = search_engine.create_index(DOCUMENTS)

		const results = search_engine.run_search(index, '記憶ゲーム')

		expect(results.map((result) => result.url)).toContain(BLOG_URL)
	})

	it('finds a project document by an English keyword', () => {
		const index = search_engine.create_index(DOCUMENTS)

		const results = search_engine.run_search(index, 'language')

		expect(results[0]?.url).toBe(PROJECT_URL)
		expect(results[0]?.type).toBe('project')
	})

	it('returns normalized result fields only', () => {
		const index = search_engine.create_index(DOCUMENTS)

		const [first] = search_engine.run_search(index, 'Mnemecha')

		const keys = Object.keys(first ?? {}).toSorted((left, right) => left.localeCompare(right))

		expect(keys).toStrictEqual(['excerpt', 'id', 'title', 'type', 'url'])
	})

	it('returns no results for an unknown keyword', () => {
		const index = search_engine.create_index(DOCUMENTS)

		expect(search_engine.run_search(index, 'kangaroo')).toStrictEqual([])
	})
})
