// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { markdown } from './markdown'

const LINK_URL = 'https://example.com'

describe('markdown.to_html', () => {
	it('renders inline code without literal backticks', () => {
		const html = markdown.to_html('use `queue` now')

		expect(html).toContain('<code>queue</code>')
		expect(html).not.toContain('`')
	})

	it('renders bold text', () => {
		expect(markdown.to_html('**kit**')).toContain('<strong>kit</strong>')
	})

	it('strips script tags', () => {
		expect(markdown.to_html('<script>alert(1)</script>hi')).not.toContain('<script')
	})

	it('strips event handlers and dangerous url schemes', () => {
		// Assembled so the literal scheme never appears in source (avoids no-script-url on test data).
		const scheme = `${['java', 'script'].join('')}:`
		const html = markdown.to_html(`<img src=x onerror="alert(1)"> [x](${scheme}alert(1))`)

		expect(html).not.toContain('onerror')
		expect(html.toLowerCase()).not.toContain(scheme)
	})
})

describe('markdown.to_html links', () => {
	it('renders a markdown link with its label and safe new-tab attributes', () => {
		const html = markdown.to_html(`[docs](${LINK_URL})`)

		expect(html).toContain(`href="${LINK_URL}"`)
		expect(html).toContain('>docs</a>')
		expect(html).toContain('target="_blank"')
		expect(html).toContain('rel="noopener noreferrer"')
	})

	it('autolinks a bare url', () => {
		expect(markdown.to_html(`see ${LINK_URL}`)).toContain(`href="${LINK_URL}"`)
	})
})

describe('markdown.to_html repairs leaked links', () => {
	it('trims trailing Japanese text off a bare-url autolink', () => {
		const html = markdown.to_html('https://example.com/game-kitです。')

		expect(html).toContain('href="https://example.com/game-kit"')
		expect(html).toContain('です。')
		expect(html).not.toContain('%E3%')
	})

	it('trims trailing Japanese punctuation off a bare-url autolink', () => {
		const html = markdown.to_html('リンクはhttps://example.com。')

		expect(html).toContain('href="https://example.com"')
		expect(html).not.toContain('href="https://example.com。"')
		expect(html).not.toContain('%E3%')
	})

	it('re-links a second url that the first autolink swallowed', () => {
		const html = markdown.to_html('https://example.com/aです。https://example.com/b')

		expect(html).toContain('href="https://example.com/a"')
		expect(html).toContain('href="https://example.com/b"')
		expect(html).toContain('です。')
		expect(html).not.toContain('%E3%')
	})

	it('drops the href of an inline link whose target absorbed a Japanese sentence', () => {
		const html = markdown.to_html('[game-kit](blog/mnemechaの文書には、game-kitです。)')

		expect(html).not.toContain('href=')
		expect(html).not.toContain('%E3%')
		expect(html).toContain('game-kit')
	})
})
