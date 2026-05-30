import { describe, expect, it } from 'vitest'
import { content_length } from './content-length'

describe('content_length.measure', () => {
	it('counts each CJK character as one unit', () => {
		expect(content_length.measure('あいうえお')).toBe(5)
	})

	it('counts Latin runs as word tokens, not characters', () => {
		expect(content_length.measure('hello world')).toBe(2)
	})

	it('sums CJK characters and Latin word tokens', () => {
		expect(content_length.measure('TypeScript と Svelte')).toBe(3)
	})

	it('ignores frontmatter', () => {
		const markdown = `---\ntitle: タイトル\nexcerpt: 概要\n---\nあい`

		expect(content_length.measure(markdown)).toBe(2)
	})

	it('ignores fenced code blocks', () => {
		const markdown = '```ts\nconst x = 1\n```\nあいう'

		expect(content_length.measure(markdown)).toBe(3)
	})

	it('keeps link text but drops the URL', () => {
		expect(content_length.measure('[TURSO](https://turso.tech/) を使う')).toBe(4)
	})
})
