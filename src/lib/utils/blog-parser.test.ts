import { describe, expect, it } from 'vitest'
import { blog_parser } from './blog-parser'

const TEST_PATH = '/src/lib/posts/test-post.md'
const TEST_AUTHOR = 'Joshua Folkken'

const BASE_FILE = {
	metadata: {
		title: 'Test Post',
		date: '2025-11-20',
		excerpt: 'A test excerpt.',
	},
}

describe('blog_parser.parse_post', () => {
	it('includes author in parsed post when frontmatter has author', () => {
		const file = { metadata: { ...BASE_FILE.metadata, author: TEST_AUTHOR } }

		const result = blog_parser.parse_post(TEST_PATH, file)

		expect(result?.author).toBe(TEST_AUTHOR)
	})

	it('sets author to undefined when frontmatter has no author', () => {
		const result = blog_parser.parse_post(TEST_PATH, BASE_FILE)

		expect(result?.author).toBeUndefined()
	})

	it('returns undefined when author is a non-string value', () => {
		const file = { metadata: { ...BASE_FILE.metadata, author: 42 } }

		const result = blog_parser.parse_post(TEST_PATH, file)

		expect(result).toBeUndefined()
	})

	it('includes youtube in parsed post when frontmatter has youtube', () => {
		const youtube_url = 'https://www.youtube.com/watch?v=UI3-GR6yvjY'
		const file = { metadata: { ...BASE_FILE.metadata, youtube: youtube_url } }

		const result = blog_parser.parse_post(TEST_PATH, file)

		expect(result?.youtube).toBe(youtube_url)
	})

	it('sets youtube to undefined when frontmatter has no youtube', () => {
		const result = blog_parser.parse_post(TEST_PATH, BASE_FILE)

		expect(result?.youtube).toBeUndefined()
	})

	it('keeps the post with youtube undefined when youtube is a non-string value', () => {
		const file = { metadata: { ...BASE_FILE.metadata, youtube: 42 } }

		const result = blog_parser.parse_post(TEST_PATH, file)

		expect(result).toBeDefined()
		expect(result?.youtube).toBeUndefined()
	})
})
