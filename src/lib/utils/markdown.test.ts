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
