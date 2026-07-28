// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { markdown } from './markdown'

const LINK_URL = 'https://example.com'
const CODE_QUEUE_HTML = '<code>queue</code>'
const STRONG_KIT_HTML = '<strong>kit</strong>'
const TARGET_BLANK = 'target="_blank"'
const REL_NOOPENER = 'rel="noopener noreferrer"'
const DOC_KEY = 'github__kit__docs__package.md'
const DOC_PATH = 'docs/package.md'
const DOC_DISPLAY = `${DOC_PATH} — kit`
// A Source URL on a non-default branch: proof that a correct href is never re-derived from a key.
const SOURCE_URL = 'https://github.com/joshuafolkken/kit/blob/master/docs/package.md'
const README_URL = 'https://github.com/joshuafolkken/joshuafolkken/blob/main/README.md'
const README_DISPLAY = 'README.md — joshuafolkken'

describe('markdown.to_html', () => {
	it('renders inline code without literal backticks', () => {
		const html = markdown.to_html('use `queue` now')

		expect(html).toContain(CODE_QUEUE_HTML)
		expect(html).not.toContain('`')
	})

	it('renders bold text', () => {
		expect(markdown.to_html('**kit**')).toContain(STRONG_KIT_HTML)
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

describe('markdown.to_html renders streaming snapshots safely', () => {
	it('formats closed markup and leaves an unclosed marker as text without throwing', () => {
		// A mid-stream snapshot where the bold marker has not been closed yet.
		const html = markdown.to_html('use `queue` and **ki')

		expect(html).toContain(CODE_QUEUE_HTML)
		expect(html).not.toContain('<strong>')
	})

	it('formats bold once the closing marker arrives in a later snapshot', () => {
		expect(markdown.to_html('use `queue` and **kit**')).toContain(STRONG_KIT_HTML)
	})
})

describe('markdown.to_html links', () => {
	it('renders a markdown link with its label and safe new-tab attributes', () => {
		const html = markdown.to_html(`[docs](${LINK_URL})`)

		expect(html).toContain(`href="${LINK_URL}"`)
		expect(html).toContain('>docs</a>')
		expect(html).toContain(TARGET_BLANK)
		expect(html).toContain(REL_NOOPENER)
	})

	it('autolinks a bare url', () => {
		expect(markdown.to_html(`see ${LINK_URL}`)).toContain(`href="${LINK_URL}"`)
	})
})

describe('markdown.to_html links code spans', () => {
	it('links a bare url inside backticks, keeping code styling and safe attributes', () => {
		const html = markdown.to_html(`\`${LINK_URL}\``)

		expect(html).toContain(`<code><a href="${LINK_URL}"`)
		expect(html).toContain(`>${LINK_URL}</a></code>`)
		expect(html).toContain(TARGET_BLANK)
		expect(html).toContain(REL_NOOPENER)
	})

	it('links a markdown link inside backticks', () => {
		const html = markdown.to_html(`\`[docs](${LINK_URL})\``)

		expect(html).toContain(`href="${LINK_URL}"`)
		expect(html).toContain('>docs</a></code>')
	})

	it('leaves a non-url code span as plain escaped code', () => {
		const html = markdown.to_html('use `queue` and `<b>&`')

		expect(html).toContain(CODE_QUEUE_HTML)
		expect(html).toContain('<code>&lt;b&gt;&amp;</code>')
		expect(html).not.toContain('<a')
	})

	it('keeps the href of a backtick-delimited url with a non-ascii path', () => {
		const non_ascii_url = 'https://ja.wikipedia.org/wiki/日本語'
		const html = markdown.to_html(`\`${non_ascii_url}\``)

		// The url is bounded by the backticks, so the leaked-text guard must not strip its href.
		expect(html).toContain(`<code><a href="${non_ascii_url}"`)
		expect(html).toContain(TARGET_BLANK)
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

describe('markdown.to_html rewrites flattened github__ citation links', () => {
	const CITATION = `[${DOC_KEY}](${DOC_KEY})`
	const BLOB_URL = 'https://github.com/joshuafolkken/kit/blob/main/docs/package.md'

	it('rewrites a flattened key link to a real GitHub blob URL', () => {
		const html = markdown.to_html(CITATION)

		expect(html).toContain(`href="${BLOB_URL}"`)
	})

	it('shows clean display text without the doubled-underscore key', () => {
		const html = markdown.to_html(CITATION)

		expect(html).toContain(DOC_DISPLAY)
		expect(html).not.toContain('github__kit')
	})

	it('no longer leaves a relative href that resolves to the site origin', () => {
		const html = markdown.to_html(CITATION)

		expect(html).not.toContain(`href="${DOC_KEY}"`)
	})

	it('leaves a normal absolute link unchanged', () => {
		const html = markdown.to_html(`[docs](${LINK_URL})`)

		expect(html).toContain(`href="${LINK_URL}"`)
	})

	it('hardens the rewritten link with target and rel', () => {
		const html = markdown.to_html(CITATION)

		expect(html).toContain(TARGET_BLANK)
		expect(html).toContain(REL_NOOPENER)
	})
})

describe('markdown.to_html cleans a flattened key out of a citation label', () => {
	// The accurate #697 path: the model links the real Source URL (correct branch) but labels it with the
	// key. Only the label is rewritten — re-deriving the href would clobber a correct branch with main.
	it('keeps a valid absolute href even when the link label looks like a key', () => {
		const html = markdown.to_html(`[${DOC_KEY}](${SOURCE_URL})`)

		expect(html).toContain(`href="${SOURCE_URL}"`)
		expect(html).not.toContain('blob/main')
	})

	it('replaces the key label with the path and repo display text (#788)', () => {
		const html = markdown.to_html(`[${DOC_KEY}](${SOURCE_URL})`)

		expect(html).toContain(DOC_DISPLAY)
		expect(html).not.toContain('github__kit')
	})

	it('drops the repo suffix the model appends after the key (#788)', () => {
		const html = markdown.to_html(
			`[github__joshuafolkken__README.md — joshuafolkken](${README_URL})`,
		)

		expect(html).toContain(`>${README_DISPLAY}<`)
		expect(html).not.toContain('github__joshuafolkken')
	})

	it('leaves a correctly labelled citation untouched', () => {
		const html = markdown.to_html(`[${DOC_DISPLAY}](${SOURCE_URL})`)

		expect(html).toContain(DOC_DISPLAY)
		expect(html).toContain(`href="${SOURCE_URL}"`)
	})

	it('leaves a label that only mentions a key in prose intact', () => {
		const html = markdown.to_html(`[the ${DOC_KEY} format](${SOURCE_URL})`)

		expect(html).toContain(`the ${DOC_KEY} format`)
	})
})

// The model cites the document's '<repo> — <path>' H1 as the label, then appends its own ' — <repo>'.
describe('markdown.to_html normalizes a citation label that repeats the repo (#794)', () => {
	it('collapses the repeated repo around the path', () => {
		const html = markdown.to_html(`[joshuafolkken — README.md — joshuafolkken](${README_URL})`)

		expect(html).toContain(`>${README_DISPLAY}<`)
	})

	it('normalizes a repo whose name starts with a dot', () => {
		const url = 'https://github.com/joshuafolkken/.github/blob/main/README.md'
		const html = markdown.to_html(`[.github — README.md — .github](${url})`)

		expect(html).toContain('>README.md — .github<')
	})

	it('reorders the bare document H1 that carries no repeated suffix', () => {
		const html = markdown.to_html(`[joshuafolkken — README.md](${README_URL})`)

		expect(html).toContain(`>${README_DISPLAY}<`)
	})

	it('keeps the cited source URL rather than rebuilding it from the label', () => {
		const html = markdown.to_html(`[kit — ${DOC_PATH} — kit](${SOURCE_URL})`)

		expect(html).toContain(`href="${SOURCE_URL}"`)
		expect(html).not.toContain('blob/main')
	})

	it('leaves a descriptive label that does not lead with the repo', () => {
		const html = markdown.to_html(`[the package doc — kit](${SOURCE_URL})`)

		expect(html).toContain('the package doc — kit')
	})

	it('leaves a repo-prefixed label on a non-GitHub link', () => {
		const html = markdown.to_html('[kit — README.md — kit](https://joshuafolkken.com/projects)')

		expect(html).toContain('kit — README.md — kit')
	})
})
