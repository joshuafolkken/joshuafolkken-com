/**
 * Render the cover-image candidate comparison page.
 *
 * The page is emitted as an HTML *fragment* — no `<!doctype>`, `<html>`, `<head>` or `<body>` of
 * its own, only a `<title>`, a `<style>` and the content. That is what an Artifact publish expects,
 * since it wraps the file in its own skeleton, and a browser opening the file directly wraps it the
 * same way. Emitting a full document instead would render fine locally and break the moment the
 * page is published, which is the form the review is actually shared in.
 *
 * Every image is inlined as a `data:` URI by the caller, so one file is the whole page.
 */

interface ReviewCandidate {
	rank: number
	source: string
	reason: string
	credit: string
	license_url: string
	filename: string
	// A `data:` URI, or an empty string when the image could not be embedded.
	image_source: string
	// Why the embed failed. Empty when it did not.
	load_error: string
}

interface ReviewPage {
	post: string
	generated_at: string
	candidates: ReadonlyArray<ReviewCandidate>
}

const MISSING_LABEL = '（表記なし）'
const HEADING = 'カバー画像候補'
const RANK_SUFFIX = '位'
const TITLE_SEPARATOR = '—'
const POST_LABEL = '記事'
const GENERATED_LABEL = '出力'
const COUNT_LABEL = '候補'
const REASON_LABEL = '順位の理由'
const CREDIT_LABEL = '出典・ライセンス表記'
const FILENAME_LABEL = '採用時のファイル名'
const SOURCE_LABEL = '取得元'
const MISSING_IMAGE_LABEL = '画像を取り込めませんでした'

// A Map rather than an object literal: the keys are punctuation, which no identifier convention
// can describe, and quoting them into a record only hides that.
const ESCAPES = new Map<string, string>([
	['&', '&amp;'],
	['<', '&lt;'],
	['>', '&gt;'],
	['"', '&quot;'],
	["'", '&#39;'],
])
const ESCAPE_PATTERN = /[&<>"']/gu

const PAGE_STYLE = `
:root {
	color-scheme: light;
	--bg: #f6f7f9;
	--card: #ffffff;
	--ink: #1b1f24;
	--muted: #5b6470;
	--line: #dfe3e8;
	--accent: #0f6fd6;
	--warn: #b3261e;
}
@media (prefers-color-scheme: dark) {
	:root:not([data-theme='light']) {
		color-scheme: dark;
		--bg: #14171c;
		--card: #1d2229;
		--ink: #e8ecf1;
		--muted: #a2acb9;
		--line: #333b45;
		--accent: #74b3ff;
		--warn: #ff8a80;
	}
}
:root[data-theme='dark'] {
	color-scheme: dark;
	--bg: #14171c;
	--card: #1d2229;
	--ink: #e8ecf1;
	--muted: #a2acb9;
	--line: #333b45;
	--accent: #74b3ff;
	--warn: #ff8a80;
}
body {
	margin: 0;
	background: var(--bg);
	color: var(--ink);
	font-family: 'Hiragino Sans', 'Noto Sans JP', system-ui, sans-serif;
	line-height: 1.7;
}
.wrap { max-width: 86rem; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
.page-header { border-bottom: 1px solid var(--line); padding-bottom: 1.25rem; margin-bottom: 2rem; }
.page-header h1 { font-size: 1.65rem; font-weight: 600; margin: 0 0 0.5rem; letter-spacing: 0.01em; }
.meta { margin: 0; color: var(--muted); font-size: 0.85rem; }
.meta span + span::before { content: '·'; margin: 0 0.5rem; }
.candidates {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 1.5rem;
	/* Side-by-side is the whole point of the page, so the cards flow into as many columns as the
	   viewport fits rather than stacking into one long scroll. The inner min() keeps the track from
	   imposing a 24rem floor on a narrow phone, which would scroll the page body sideways. */
	grid-template-columns: repeat(auto-fill, minmax(min(24rem, 100%), 1fr));
	align-items: start;
}
.candidate {
	background: var(--card);
	border: 1px solid var(--line);
	border-radius: 0.75rem;
	overflow: hidden;
}
.rank {
	display: flex;
	align-items: baseline;
	gap: 0.6rem;
	padding: 0.9rem 1.25rem;
	border-bottom: 1px solid var(--line);
	font-weight: 600;
}
.rank b { font-size: 1.5rem; color: var(--accent); font-variant-numeric: tabular-nums; }
.rank small { color: var(--muted); font-weight: 400; font-size: 0.8rem; }
figure { margin: 0; background: var(--bg); }
figure img { display: block; width: 100%; height: auto; }
.missing-image {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 12rem;
	padding: 1.5rem;
	color: var(--warn);
	font-size: 0.9rem;
	text-align: center;
}
dl { margin: 0; padding: 1.1rem 1.25rem 1.35rem; display: grid; gap: 0.75rem; }
dt { color: var(--muted); font-size: 0.75rem; letter-spacing: 0.06em; margin-bottom: 0.15rem; }
dd { margin: 0; overflow-wrap: anywhere; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85em; }
a { color: var(--accent); }
.empty { color: var(--warn); }
`

function escape_html(value: string): string {
	return value.replaceAll(ESCAPE_PATTERN, (character) => ESCAPES.get(character) ?? character)
}

// Escapes a `<label>: <value>` pair in one place, so no caller has to nest a template literal
// inside the page's own markup template.
function escape_pair(label: string, value: string): string {
	return escape_html(`${label}: ${value}`)
}

function render_field(label: string, html: string): string {
	return `<div><dt>${escape_html(label)}</dt><dd>${html}</dd></div>`
}

// An empty value is rendered as a marked placeholder rather than skipped: a missing license line is
// exactly what the reviewer has to notice before adopting the image.
function text_value(value: string): string {
	if (value === '') return `<span class="empty">${escape_html(MISSING_LABEL)}</span>`

	return escape_html(value)
}

function code_value(value: string): string {
	if (value === '') return text_value(value)

	return `<code>${escape_html(value)}</code>`
}

// A blank value stays a marked blank even when a URL is present: wrapping the "no attribution"
// placeholder in a link would turn the warning into something that reads like an attribution.
function link_value(value: string, href: string): string {
	if (href === '' || value === '') return text_value(value)

	return `<a href="${escape_html(href)}" rel="noreferrer">${escape_html(value)}</a>`
}

function credit_value(candidate: ReviewCandidate): string {
	return link_value(candidate.credit, candidate.license_url)
}

function render_image(candidate: ReviewCandidate): string {
	// Escaped like every other value the manifest supplies. The data URI is assembled from a MIME
	// type a remote host sent, so treating it as trusted markup is what would let that host close
	// the `src` attribute and add one of its own.
	if (candidate.image_source !== '') {
		return `<img src="${escape_html(candidate.image_source)}" alt="" loading="lazy">`
	}

	const text =
		candidate.load_error === ''
			? escape_html(MISSING_IMAGE_LABEL)
			: escape_pair(MISSING_IMAGE_LABEL, candidate.load_error)

	return `<div class="missing-image">${text}</div>`
}

function render_rank(rank: number): string {
	const number = escape_html(String(rank))

	return `<div class="rank"><b>${number}</b><small>${escape_html(RANK_SUFFIX)}</small></div>`
}

function render_candidate(candidate: ReviewCandidate): string {
	const fields = [
		render_field(REASON_LABEL, text_value(candidate.reason)),
		render_field(CREDIT_LABEL, credit_value(candidate)),
		render_field(FILENAME_LABEL, code_value(candidate.filename)),
		render_field(SOURCE_LABEL, code_value(candidate.source)),
	]

	return [
		'<li class="candidate">',
		render_rank(candidate.rank),
		`<figure>${render_image(candidate)}</figure>`,
		`<dl>${fields.join('')}</dl>`,
		'</li>',
	].join('')
}

function render_meta(page: ReviewPage): string {
	const pairs = [
		escape_pair(POST_LABEL, page.post),
		escape_pair(COUNT_LABEL, String(page.candidates.length)),
		escape_pair(GENERATED_LABEL, page.generated_at),
	]

	return pairs.map((pair) => `<span>${pair}</span>`).join('')
}

function render_header(page: ReviewPage): string {
	const heading = escape_html(HEADING)

	return `<header class="page-header"><h1>${heading}</h1><p class="meta">${render_meta(page)}</p></header>`
}

function render_page(page: ReviewPage): string {
	const cards = page.candidates.map((candidate) => render_candidate(candidate)).join('')
	const title = escape_html(`${HEADING} ${TITLE_SEPARATOR} ${page.post}`)

	return [
		`<title>${title}</title>`,
		`<style>${PAGE_STYLE}</style>`,
		'<div class="wrap">',
		render_header(page),
		`<ol class="candidates">${cards}</ol>`,
		'</div>',
		'',
	].join('\n')
}

const blog_cover_review_page = {
	MISSING_LABEL,
	MISSING_IMAGE_LABEL,
	escape_html,
	render_candidate,
	render_page,
}

export type { ReviewCandidate, ReviewPage }
export { blog_cover_review_page }
