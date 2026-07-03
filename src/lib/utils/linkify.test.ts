import { describe, expect, it } from 'vitest'
import { linkify } from './linkify'

const PLAIN = 'no links here'
const LINK_CLASS = 'lc'
const KIT_URL = 'https://joshuafolkken.com/blog/kit-2'
const ABOUT_URL = 'https://joshuafolkken.com/about'
const BLOG_URL = 'https://joshuafolkken.com/blog'

describe('linkify.to_segments', () => {
	it('returns a single plain segment when there is no url', () => {
		expect(linkify.to_segments(PLAIN)).toEqual([{ text: PLAIN }])
	})

	it('splits a url into a linked segment', () => {
		expect(linkify.to_segments(`see ${KIT_URL} now`)).toEqual([
			{ text: 'see ' },
			{ text: KIT_URL, href: KIT_URL },
			{ text: ' now' },
		])
	})

	it('keeps trailing punctuation out of the link', () => {
		expect(linkify.to_segments(`${ABOUT_URL}.`)).toEqual([
			{ text: ABOUT_URL, href: ABOUT_URL },
			{ text: '.' },
		])
	})

	it('does not swallow adjacent japanese text', () => {
		const [link] = linkify.to_segments(`${BLOG_URL}のページ`)

		expect(link).toEqual({ text: BLOG_URL, href: BLOG_URL })
	})
})

describe('linkify.to_html', () => {
	it('wraps a url in an anchor tag', () => {
		const html = linkify.to_html(`see ${ABOUT_URL}`, LINK_CLASS)

		expect(html).toContain(`<a href="${ABOUT_URL}"`)
		expect(html).toContain('target="_blank"')
	})

	it('escapes html in plain text', () => {
		expect(linkify.to_html('<b>x</b>', LINK_CLASS)).toBe('&lt;b&gt;x&lt;/b&gt;')
	})
})
