import type { Post } from '$lib/types/blog'
import { blog_parser } from '$lib/utils/blog-parser'
import { content_length } from '$lib/utils/content-length'
import {
	GRANDFATHERED_SLUGS,
	MIN_NEW_POST_CONTENT_LENGTH,
	post_standards,
	TARGET_NEW_POST_CONTENT_LENGTH,
} from '$lib/utils/post-standards'
import { describe, expect, it } from 'vitest'

const POST_PATH_PREFIX = '/src/lib/posts/'
const POST_PATH_SUFFIX = '.md'

const raw_posts = import.meta.glob<string>('/src/lib/posts/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
})

function to_slug(path: string): string {
	return path.slice(POST_PATH_PREFIX.length, -POST_PATH_SUFFIX.length)
}

function measure(slug: string): number {
	return content_length.measure(raw_posts[`${POST_PATH_PREFIX}${slug}${POST_PATH_SUFFIX}`] ?? '')
}

function to_post(overrides: Partial<Post>): Post {
	return {
		slug: 'a-new-post',
		title: 'title',
		date: '2026-08-30',
		author: 'Joshua Folkken',
		excerpt: 'excerpt',
		cover_image: '/api/images/blog/a-new-post.webp',
		...overrides,
	}
}

describe('post_standards.check_post length floor', () => {
	it('accepts a post that reaches the floor', () => {
		expect(post_standards.check_post(to_post({}), MIN_NEW_POST_CONTENT_LENGTH)).toEqual([])
	})

	it('rejects a post one below the floor', () => {
		const below = MIN_NEW_POST_CONTENT_LENGTH - 1
		const expected = `measures ${String(below)}, below the ${String(MIN_NEW_POST_CONTENT_LENGTH)} floor`

		expect(post_standards.check_post(to_post({}), below)).toEqual([expected])
	})
})

describe('post_standards.check_post metadata', () => {
	it('rejects a post with no author', () => {
		const post = to_post({ author: undefined })

		expect(post_standards.check_post(post, TARGET_NEW_POST_CONTENT_LENGTH)).toEqual([
			'has no `author`',
		])
	})

	it('rejects a post with no card image source', () => {
		const post = to_post({ cover_image: undefined })

		expect(post_standards.check_post(post, TARGET_NEW_POST_CONTENT_LENGTH)).toEqual([
			'has neither `cover_image` nor `youtube`',
		])
	})

	it('accepts a video-derived post that has no cover image of its own', () => {
		const post = to_post({ cover_image: undefined, youtube: 'https://youtu.be/abc' })

		expect(post_standards.check_post(post, TARGET_NEW_POST_CONTENT_LENGTH)).toEqual([])
	})

	it('reports every problem a post has at once', () => {
		const post = to_post({ author: undefined, cover_image: undefined })

		expect(post_standards.check_post(post, 0)).toHaveLength(3)
	})

	it('exempts a grandfathered post from every check', () => {
		const slug = [...GRANDFATHERED_SLUGS][0] ?? ''
		const post = to_post({ slug, author: undefined, cover_image: undefined })

		expect(post_standards.check_post(post, 0)).toEqual([])
	})
})

const posts = blog_parser.get_all_posts()
const parsed_slugs = new Set(posts.map((post) => post.slug))
const checked_posts = posts.filter((post) => !post_standards.is_grandfathered(post.slug))

describe('published posts', () => {
	// A post missing `title`, `date` or `excerpt` is dropped by the parser and vanishes from the blog
	// list, so a file with no parsed post is one no reader can reach.
	it('parses every markdown file into a listed post', () => {
		const on_disk = new Set(Object.keys(raw_posts).map((path) => to_slug(path)))

		expect([...on_disk.difference(parsed_slugs)]).toEqual([])
	})

	it.each(checked_posts)('$slug meets the standards in docs/blog-writing.md', (post) => {
		expect(post_standards.check_post(post, measure(post.slug))).toEqual([])
	})
})

describe('grandfathered list', () => {
	it('holds no post that no longer exists', () => {
		expect([...GRANDFATHERED_SLUGS.difference(parsed_slugs)]).toEqual([])
	})

	it('holds no post that already reaches the floor', () => {
		const passing = [...GRANDFATHERED_SLUGS].filter(
			(slug) => measure(slug) >= MIN_NEW_POST_CONTENT_LENGTH,
		)

		expect(passing).toEqual([])
	})
})
