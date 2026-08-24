import type { SearchDocument } from '$lib/types/search'
import { related_posts, RELATED_POSTS_LIMIT } from '$lib/utils/related-posts'
import { describe, expect, it } from 'vitest'

const SVELTE_URL = '/blog/svelte-routing'
const SVELTE_FORMS_URL = '/blog/svelte-forms'
const GODOT_URL = '/blog/godot-shaders'
const COFFEE_URL = '/blog/coffee'

function to_document(url: string, title: string, body: string): SearchDocument {
	return { id: url, type: 'blog', title, excerpt: title, body, url }
}

// Newest first, the order the source is built in, so the fallback picks recent posts.
const DOCUMENTS: Array<SearchDocument> = [
	to_document(SVELTE_URL, 'SvelteKit のルーティングを整理した', 'ルーティングと load の話'),
	to_document(SVELTE_FORMS_URL, 'SvelteKit のフォーム実装', 'フォームと load の話'),
	to_document(GODOT_URL, 'Godot のシェーダー入門', 'シェーダーの書き方'),
	to_document(COFFEE_URL, 'コーヒーの淹れ方', '豆と湯温'),
]

const SOURCE = related_posts.build_source(DOCUMENTS)
const QUERY_TEXT = new Map(DOCUMENTS.map((entry) => [entry.id, `${entry.title} ${entry.body}`]))

function select(url: string, limit: number = RELATED_POSTS_LIMIT): Array<string> {
	return related_posts.select(SOURCE, { id: url, text: QUERY_TEXT.get(url) ?? '' }, limit)
}

describe('related_posts.select', () => {
	it('never recommends the article the reader is already on', () => {
		expect(select(SVELTE_URL)).not.toContain(SVELTE_URL)
	})

	it('ranks the article sharing the most words first', () => {
		expect(select(SVELTE_URL)[0]).toBe(SVELTE_FORMS_URL)
	})

	it('returns at most the requested number of articles', () => {
		expect(select(SVELTE_URL, 2)).toHaveLength(2)
	})

	it('defaults to three articles', () => {
		expect(select(SVELTE_URL)).toHaveLength(RELATED_POSTS_LIMIT)
	})

	it('fills up with the newest articles when nothing shares any words', () => {
		const query = { id: '/blog/unknown', text: 'kangaroo' }

		expect(related_posts.select(SOURCE, query)).toStrictEqual([
			SVELTE_URL,
			SVELTE_FORMS_URL,
			GODOT_URL,
		])
	})

	it('recommends indexed articles to an article that is not itself a candidate', () => {
		const query = { id: '/blog/too-short', text: 'SvelteKit の load の話' }

		expect(related_posts.select(SOURCE, query)).toContain(SVELTE_URL)
	})
})
