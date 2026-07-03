import { markup } from './escape'

interface Segment {
	text: string
	href?: string
}

// URLs are ASCII; stop at whitespace and CJK chars so adjacent Japanese text is not swallowed
// (\s already covers the ideographic space U+3000, so the range starts at U+3001).
const URL_PATTERN = /https?:\/\/[^\s、-鿿]+/gu
/* eslint-disable-next-line sonarjs/super-linear-regex -- runs only on an already-matched short URL */
const TRAILING_PUNCTUATION = /[.,;:!?)\]}]+$/u

function split_url(raw: string): Array<Segment> {
	const trailing = TRAILING_PUNCTUATION.exec(raw)

	if (!trailing) return [{ text: raw, href: raw }]

	const url = raw.slice(0, raw.length - trailing[0].length)

	return [{ text: url, href: url }, { text: raw.slice(url.length) }]
}

function to_segments(text: string): Array<Segment> {
	const segments: Array<Segment> = []
	let last = 0

	for (const match of text.matchAll(URL_PATTERN)) {
		if (match.index > last) segments.push({ text: text.slice(last, match.index) })

		segments.push(...split_url(match[0]))
		last = match.index + match[0].length
	}

	if (last < text.length) segments.push({ text: text.slice(last) })

	return segments
}

function segment_to_html(segment: Segment, link_class: string): string {
	const label = markup.escape(segment.text)

	if (segment.href === undefined) return label

	const attributes = `href="${markup.escape(segment.href)}" target="_blank" rel="noopener noreferrer" class="${markup.escape(link_class)}"`

	return `<a ${attributes}>${label}</a>`
}

// URL_PATTERN only matches http(s) URLs and every segment is HTML-escaped, so the result is safe
// to render with {@html} (no javascript: schemes, no attribute/tag breakout).
function to_html(text: string, link_class: string): string {
	return to_segments(text)
		.map((segment) => segment_to_html(segment, link_class))
		.join('')
}

const linkify = { to_segments, to_html }

export { linkify }
export type { Segment }
