import type { Post } from '$lib/types/blog'
import type { Page } from '$lib/types/page'
import { search_index } from '$lib/utils/search-index'
import { describe, expect, it } from 'vitest'

const POST_TITLE = '記憶ゲームを作った'

const SAMPLE_POST: Post = {
	slug: 'mnemecha',
	title: POST_TITLE,
	date: '2026-05-14',
	excerpt: 'シンプルな記憶ゲーム',
}

const RAW_MARKDOWN = `---
title: ${POST_TITLE}
date: '2026-05-14'
---

## 見出し

本文に [リンク](https://example.com) を含む。

\`\`\`ts
const secret = 1
\`\`\`
`

describe('search_index.markdown_to_text', () => {
	it('strips frontmatter, code blocks, and markdown syntax', () => {
		const text = search_index.markdown_to_text(RAW_MARKDOWN)

		expect(text).toContain('見出し')
		expect(text).toContain('本文')
		expect(text).toContain('リンク')
		expect(text).not.toContain('secret')
		expect(text).not.toContain('---')
		expect(text).not.toContain('#')
	})
})

describe('search_index.post_to_document', () => {
	it('maps a post and its raw body to a blog SearchDocument', () => {
		const result = search_index.post_to_document(SAMPLE_POST, RAW_MARKDOWN)

		expect(result.type).toBe('blog')
		expect(result.url).toBe('/blog/mnemecha')
		expect(result.title).toBe(POST_TITLE)
		expect(result.body).toContain('見出し')
	})
})

describe('search_index.project_to_document', () => {
	it('maps a project to a SearchDocument with tags folded into the body', () => {
		const subtitle = 'Language Learning Game'
		const result = search_index.project_to_document({
			slug: 'talk',
			title: 'Talk',
			subtitle,
			description: 'Learn by listening and speaking',
			tags: ['SvelteKit', 'TypeScript'],
		})

		expect(result.type).toBe('project')
		expect(result.url).toBe('/projects/talk')
		expect(result.excerpt).toBe(subtitle)
		expect(result.body).toContain('SvelteKit')
	})
})

describe('search_index.page_to_document', () => {
	it('maps a page with an internal link to a page SearchDocument', () => {
		const page: Page = { title: 'About', description: 'Who I am', link: '/about' }

		expect(search_index.page_to_document(page)).toStrictEqual({
			id: '/about',
			type: 'page',
			title: 'About',
			excerpt: 'Who I am',
			body: 'About Who I am',
			url: '/about',
		})
	})

	it('returns undefined for external or missing links', () => {
		const external: Page = { title: 'X', description: 'external', link: 'https://x.com' }
		const no_link_page: Page = { title: 'Social', description: 'no link' }

		expect(search_index.page_to_document(external)).toBeUndefined()
		expect(search_index.page_to_document(no_link_page)).toBeUndefined()
	})
})
