import { describe, expect, it } from 'vitest'
import {
	blog_cover_review_page,
	type ReviewCandidate,
	type ReviewPage,
} from './blog-cover-review-page'

const POST = 'my-post-slug'
const GENERATED_AT = '2026-08-31T09:00:00.000Z'
const DATA_URI = 'data:image/png;base64,aGVsbG8='
const SOURCE = '.covers/my-post-slug/20260831-120000-01.png'
const REASON = '本文の主題と合っている'
const CREDIT = 'Photo by Someone on Unsplash'
const LICENSE_URL = 'https://unsplash.com/license'
const FILENAME = 'my-post-slug.png'
const CREDIT_LABEL = '出典・ライセンス表記'
const FILENAME_LABEL = '採用時のファイル名'

function make_candidate(overrides: Partial<ReviewCandidate> = {}): ReviewCandidate {
	return {
		rank: 1,
		source: SOURCE,
		reason: REASON,
		credit: CREDIT,
		license_url: LICENSE_URL,
		filename: FILENAME,
		image_source: DATA_URI,
		load_error: '',
		...overrides,
	}
}

function make_page(candidates: ReadonlyArray<ReviewCandidate>): ReviewPage {
	return { post: POST, generated_at: GENERATED_AT, candidates }
}

describe('blog_cover_review_page.escape_html', () => {
	it('escapes every character that could close a tag or an attribute', () => {
		expect(blog_cover_review_page.escape_html(`<a href="x">&'`)).toBe(
			'&lt;a href=&quot;x&quot;&gt;&amp;&#39;',
		)
	})
})

describe('blog_cover_review_page.render_candidate', () => {
	it('renders the rank, reason, credit, adopted filename and source', () => {
		const html = blog_cover_review_page.render_candidate(make_candidate())

		expect(html).toContain('<b>1</b>')
		expect(html).toContain(REASON)
		expect(html).toContain(CREDIT)
		expect(html).toContain(LICENSE_URL)
		expect(html).toContain(`<code>${FILENAME}</code>`)
		expect(html).toContain(SOURCE)
	})

	it('embeds the image as the data URI it was given', () => {
		expect(blog_cover_review_page.render_candidate(make_candidate())).toContain(
			`<img src="${DATA_URI}"`,
		)
	})
})

describe('blog_cover_review_page.render_candidate blanks and failures', () => {
	it('marks an empty credit as blank instead of dropping the field', () => {
		const html = blog_cover_review_page.render_candidate(
			make_candidate({ credit: '', license_url: '' }),
		)

		expect(html).toContain(CREDIT_LABEL)
		expect(html).toContain(blog_cover_review_page.MISSING_LABEL)
	})

	it('marks an empty adopted filename as blank instead of dropping the field', () => {
		const html = blog_cover_review_page.render_candidate(make_candidate({ filename: '' }))

		expect(html).toContain(FILENAME_LABEL)
		expect(html).toContain(blog_cover_review_page.MISSING_LABEL)
	})

	it('renders a credit with no license URL as plain text rather than an empty link', () => {
		const html = blog_cover_review_page.render_candidate(make_candidate({ license_url: '' }))

		expect(html).toContain(CREDIT)
		expect(html).not.toContain('<a href=""')
	})
})

describe('blog_cover_review_page.render_candidate blank markers', () => {
	it('does not linkify the blank marker when only the license URL is present', () => {
		const html = blog_cover_review_page.render_candidate(make_candidate({ credit: '' }))

		expect(html).toContain(blog_cover_review_page.MISSING_LABEL)
		expect(html).not.toContain('<a href=')
	})

	it('names the missing-image reason once when no reason was recorded', () => {
		const html = blog_cover_review_page.render_candidate(make_candidate({ image_source: '' }))

		expect(html.split(blog_cover_review_page.MISSING_IMAGE_LABEL)).toHaveLength(2)
	})

	it('keeps a candidate whose image could not be embedded, showing the reason', () => {
		const html = blog_cover_review_page.render_candidate(
			make_candidate({ image_source: '', load_error: 'HTTP 404: https://example.test/a.png' }),
		)

		expect(html).toContain(blog_cover_review_page.MISSING_IMAGE_LABEL)
		expect(html).toContain('HTTP 404')
		expect(html).not.toContain('<img')
	})
})

describe('blog_cover_review_page.render_candidate escaping', () => {
	it('escapes the image source so a data URI cannot close the src attribute', () => {
		const html = blog_cover_review_page.render_candidate(
			make_candidate({ image_source: 'data:image/png" onerror="alert(1)' }),
		)

		expect(html).not.toContain('onerror="alert(1)"')
		expect(html).toContain('&quot; onerror=')
	})

	it('escapes candidate text so a manifest cannot inject markup', () => {
		const html = blog_cover_review_page.render_candidate(
			make_candidate({ reason: '<script>alert(1)</script>' }),
		)

		expect(html).not.toContain('<script>')
		expect(html).toContain('&lt;script&gt;')
	})
})

describe('blog_cover_review_page.render_page', () => {
	it('emits a fragment with no document skeleton, so an Artifact publish can wrap it', () => {
		const html = blog_cover_review_page.render_page(make_page([make_candidate()]))

		expect(html).not.toContain('<!doctype')
		expect(html).not.toContain('<html')
		expect(html).not.toContain('<body')
		expect(html).toContain('<title>')
		expect(html).toContain('<style>')
	})

	it('reports the post, the candidate count and when it was generated', () => {
		const page = make_page([make_candidate(), make_candidate({ rank: 2 })])
		const html = blog_cover_review_page.render_page(page)

		expect(html).toContain(POST)
		expect(html).toContain('候補: 2')
		expect(html).toContain(GENERATED_AT)
	})

	it('renders one list item per candidate', () => {
		const html = blog_cover_review_page.render_page(
			make_page([make_candidate(), make_candidate({ rank: 2 }), make_candidate({ rank: 3 })]),
		)

		expect(html.split('<li class="candidate">')).toHaveLength(4)
	})
})
