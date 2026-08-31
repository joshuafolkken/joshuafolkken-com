import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { blog_post_source } from './blog-post-source'

const SLUG = 'my-post'
const POST_PATH = 'src/lib/posts/my-post.md'
const EXPLICIT_POST_PATH = 'drafts/other.md'
const TITLE = 'カバー画像を作る話'
const EXCERPT = '画像候補を機械的に用意する'
const BODY = '本文の一行目です。'
const POST = `---\ntitle: ${TITLE}\ndate: '2026-08-30 10:00'\nexcerpt: "${EXCERPT}"\n---\n\n${BODY}\n`
const BODY_LIMIT = 2000
const LONG_BODY_LENGTH = 3000

describe('blog_post_source.resolve_post_path', () => {
	it('resolves a bare slug inside the posts directory', () => {
		expect(blog_post_source.resolve_post_path(SLUG)).toBe(path.join('src/lib/posts', 'my-post.md'))
	})

	it('keeps an explicit markdown path as given', () => {
		expect(blog_post_source.resolve_post_path(EXPLICIT_POST_PATH)).toBe(EXPLICIT_POST_PATH)
	})

	it('derives the slug from a post path', () => {
		expect(blog_post_source.resolve_slug(POST_PATH)).toBe(SLUG)
	})
})

describe('blog_post_source.read_summary', () => {
	it('reads the title and excerpt and keeps the body', () => {
		const summary = blog_post_source.read_summary(POST_PATH, POST, BODY_LIMIT)

		expect(summary).toEqual({ slug: SLUG, title: TITLE, excerpt: EXCERPT, body: BODY })
	})

	it('leaves the excerpt empty when the frontmatter has none', () => {
		const summary = blog_post_source.read_summary(
			POST_PATH,
			`---\ntitle: ${TITLE}\n---\n\nbody`,
			BODY_LIMIT,
		)

		expect(summary.excerpt).toBe('')
	})

	it('truncates a body longer than the requested limit', () => {
		const long_body = 'あ'.repeat(LONG_BODY_LENGTH)
		const summary = blog_post_source.read_summary(
			POST_PATH,
			`---\ntitle: ${TITLE}\n---\n\n${long_body}`,
			BODY_LIMIT,
		)

		expect(summary.body).toHaveLength(BODY_LIMIT)
	})

	// A draft outside the posts directory shares its basename with a real post, so the report has to
	// name the path that was read rather than the name it happens to end in.
	it('names the file it read when the frontmatter has no title', () => {
		expect(() =>
			blog_post_source.read_summary(EXPLICIT_POST_PATH, `---\nexcerpt: x\n---\n\nbody`, BODY_LIMIT),
		).toThrow(`No \`title\` in the frontmatter of ${EXPLICIT_POST_PATH}`)
	})
})
