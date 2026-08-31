import { describe, expect, it } from 'vitest'
import { blog_frontmatter } from './blog-frontmatter'

const TITLE = 'カバー画像を作る話'
const APOSTROPHE_TITLE = "Josh's kit"
const ESCAPED_TITLE_LINE = "title: 'Josh''s kit'"
const NESTED_TITLE_BLOCK = 'seo:\n  title: nested\ntitle: real'
const SOURCE = 'my-post.md'

describe('blog_frontmatter.split_frontmatter', () => {
	it('separates the leading block from the body', () => {
		expect(blog_frontmatter.split_frontmatter(`---\ntitle: ${TITLE}\n---\n\nbody\n`)).toEqual({
			frontmatter: `title: ${TITLE}`,
			body: 'body',
		})
	})

	it('treats a file without frontmatter as all body', () => {
		expect(blog_frontmatter.split_frontmatter('just body')).toEqual({
			frontmatter: '',
			body: 'just body',
		})
	})

	it('treats an unterminated block as all body', () => {
		expect(blog_frontmatter.split_frontmatter(`---\ntitle: ${TITLE}`).frontmatter).toBe('')
	})
})

describe('blog_frontmatter.read_field', () => {
	// `inject-talk-frontmatter.ts` writes titles as single-quoted YAML and doubles any apostrophe
	// in them, so a reader that only strips the outer quotes hands `Josh''s kit` to its caller.
	it('unescapes a doubled quote inside a single-quoted scalar', () => {
		const document = blog_frontmatter.parse_frontmatter(ESCAPED_TITLE_LINE, SOURCE)

		expect(blog_frontmatter.read_field(document, 'title')).toBe(APOSTROPHE_TITLE)
	})

	// A nested mapping's `title:` comes first in a line scan, so the post would have been described
	// by whatever some other block happened to call itself.
	it('does not let a nested mapping shadow the top-level key of the same name', () => {
		const document = blog_frontmatter.parse_frontmatter(NESTED_TITLE_BLOCK, SOURCE)

		expect(blog_frontmatter.read_field(document, 'title')).toBe('real')
	})

	it('returns undefined for a key the block does not carry', () => {
		const document = blog_frontmatter.parse_frontmatter('title: x', SOURCE)

		expect(blog_frontmatter.read_field(document, 'excerpt')).toBeUndefined()
	})

	// The site drops a post whose `title` is not a string, so reading one here would send the cover
	// generator a prompt describing a post the blog will never render.
	it('reads a non-string value as absent', () => {
		const document = blog_frontmatter.parse_frontmatter('title: 2026', SOURCE)

		expect(blog_frontmatter.read_field(document, 'title')).toBeUndefined()
	})

	// The site's own parser stopped reading `yes` / `no` / `on` / `off` as booleans, so pinning this
	// scalar as a string is what keeps the two in step — asking for YAML 1.1 here would silently
	// turn a one-word title into `true`.
	it('reads an unquoted yes as the word rather than a boolean', () => {
		const document = blog_frontmatter.parse_frontmatter('title: yes', SOURCE)

		expect(blog_frontmatter.read_field(document, 'title')).toBe('yes')
	})

	it('reads nothing out of an empty block', () => {
		const document = blog_frontmatter.parse_frontmatter('', SOURCE)

		expect(blog_frontmatter.read_field(document, 'title')).toBeUndefined()
	})
})

describe('blog_frontmatter.parse_frontmatter', () => {
	// Reading a broken block as far as it happens to parse would let a caller act on a value nobody
	// wrote — for the cover generator, a billed request built from half a prompt.
	// The slug a caller typed resolves to a path, so a report that named no file would leave the
	// reader unsure which post was actually read.
	it('names the file it was reading when the block is not valid YAML', () => {
		expect(() => blog_frontmatter.parse_frontmatter('title: [unclosed', SOURCE)).toThrow(
			`Invalid frontmatter YAML in ${SOURCE}`,
		)
	})
})
