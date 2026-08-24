import { related_post_source } from '$lib/server/related-post-source'
import { TEST_ROUTES } from '$lib/test-routes'
import { blog_parser } from '$lib/utils/blog-parser'
import { content_length } from '$lib/utils/content-length'
import { content_quality } from '$lib/utils/content-quality'
import { RELATED_POSTS_LIMIT } from '$lib/utils/related-posts'
import { describe, expect, it } from 'vitest'

const BLOG_PREFIX = '/blog/'
const ARTICLE_SLUG = TEST_ROUTES.BLOG_POST.replace(BLOG_PREFIX, '')
const THIN_SLUG = TEST_ROUTES.BLOG_THIN_POST.replace(BLOG_PREFIX, '')

const raw_posts = import.meta.glob<string>('/src/lib/posts/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
})

const ALL_SLUGS = blog_parser.get_all_posts().map((post) => post.slug)

function is_substantial(slug: string): boolean {
	return content_quality.is_substantial(
		content_length.measure(raw_posts[`/src/lib/posts/${slug}.md`] ?? ''),
	)
}

describe('related_post_source.load', () => {
	it('recommends a full set of articles for a published post', () => {
		expect(related_post_source.load(ARTICLE_SLUG)).toHaveLength(RELATED_POSTS_LIMIT)
	})

	it('recommends a full set even for a post too short to be recommended itself', () => {
		expect(related_post_source.load(THIN_SLUG)).toHaveLength(RELATED_POSTS_LIMIT)
	})

	it('never recommends the post being read', () => {
		const self_referencing = ALL_SLUGS.filter((slug) =>
			related_post_source.load(slug).some((post) => post.slug === slug),
		)

		expect(self_referencing).toStrictEqual([])
	})

	// The gate that decides indexing decides recommendations too: a post nobody should land on from
	// a search engine is not a post to send a reader to from another article.
	it('only recommends posts above the content-length gate', () => {
		const recommended = ALL_SLUGS.flatMap((slug) =>
			related_post_source.load(slug).map((post) => post.slug),
		)

		expect(recommended.filter((slug) => !is_substantial(slug))).toStrictEqual([])
	})
})
