import DOMPurify from 'dompurify'
import { marked } from 'marked'

// Hiragana, Katakana, and CJK ideographs. marked's link boundary detection stops only at ASCII
// whitespace, and Japanese text has none, so a sentence written right after a link target gets
// swallowed into the href; matching these scripts lets us find where the URL really ends.
const CJK_CHAR = /[\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Han}]/u

// A trimmed target only stays a link when the remaining prefix still looks like one.
const URL_LIKE = /^(?:https?:\/\/|www\.|\/)/u

// LLM answers are untrusted input rendered via {@html}; every link must open safely in a new tab.
function harden_link(node: Element): void {
	if (node.tagName !== 'A') return

	node.setAttribute('target', '_blank')
	node.setAttribute('rel', 'noopener noreferrer')
}

function safe_decode(value: string): string {
	try {
		return decodeURIComponent(value)
	} catch {
		return value
	}
}

// marked percent-encodes non-ASCII href characters, so decode before checking for leaked sentence text.
function has_leaked_text(href: string): boolean {
	return CJK_CHAR.test(safe_decode(href))
}

function is_leaked_anchor(anchor: HTMLAnchorElement): boolean {
	const href = anchor.getAttribute('href')

	return href ? has_leaked_text(href) : false
}

// Re-render the trimmed-off tail as inline markdown so any further URLs it swallowed get autolinked
// again instead of staying dead plain text. parseInline keeps it inline (no wrapping <p>); the newly
// re-linked URLs may over-absorb in turn, which the repair_links loop then trims on its next pass.
function render_tail(text: string): string {
	const raw = marked.parseInline(text, { async: false, gfm: true })

	return DOMPurify.sanitize(raw)
}

// A bare-url autolink carries the leaked text in its label too; cut both back to the real URL and
// re-render the trailing sentence so its own links survive while the leaked text becomes plain text.
function trim_autolink(anchor: HTMLAnchorElement, text: string, cut: number): void {
	const url_part = text.slice(0, cut)

	anchor.setAttribute('href', url_part)
	anchor.textContent = url_part
	anchor.insertAdjacentHTML('afterend', render_tail(text.slice(cut)))
}

// An inline [label](target) link whose target absorbed a sentence has an unrecoverable URL, so drop
// the anchor and keep just its visible label as plain text rather than render a link to garbage.
// replaceWith turns a string into a text node (never parsed as HTML), so the label stays inert.
function unwrap(anchor: HTMLAnchorElement, text: string): void {
	anchor.replaceWith(text)
}

// True when the prefix before the leaked text is itself a URL, i.e. a bare-url autolink whose tail we
// can trim rather than an inline [label](target) link whose target is unrecoverable garbage.
function can_trim_autolink(text: string, cut: number): boolean {
	return cut > 0 && URL_LIKE.test(text.slice(0, cut))
}

function repair_anchor(anchor: HTMLAnchorElement): void {
	const href = anchor.getAttribute('href')
	if (!href || !has_leaked_text(href)) return

	const text = anchor.textContent
	const cut = text.search(CJK_CHAR)

	if (can_trim_autolink(text, cut)) {
		trim_autolink(anchor, text, cut)
	} else {
		unwrap(anchor, text)
	}
}

function first_leaked_anchor(root: Document): HTMLAnchorElement | undefined {
	for (const anchor of root.querySelectorAll('a')) {
		if (is_leaked_anchor(anchor)) return anchor
	}

	return undefined
}

// Repair every anchor whose target absorbed Japanese sentence text (see CJK_CHAR). trim_autolink can
// insert a fresh over-absorbing anchor for a second URL, so re-scan until none are left rather than
// snapshotting the anchors up front; each repair shrinks the leaked text, so the loop terminates.
function repair_links(html: string): string {
	if (!('window' in globalThis)) return html

	const html_document = new DOMParser().parseFromString(html, 'text/html')
	let anchor = first_leaked_anchor(html_document)

	while (anchor) {
		repair_anchor(anchor)
		anchor = first_leaked_anchor(html_document)
	}

	return html_document.body.innerHTML
}

// DOMPurify only works where a DOM exists (browser + jsdom tests), not during Workers SSR — and
// to_html is only ever called client-side, so registering the hook behind a window guard is safe.
if ('window' in globalThis) {
	DOMPurify.addHook('afterSanitizeAttributes', harden_link)
}

// Render Markdown from the AI chat model to HTML. marked handles the Markdown; DOMPurify strips any
// unsafe HTML the model may emit (scripts, event handlers, javascript: URLs) before {@html} renders.
// repair_links then fixes hrefs that marked let absorb the following Japanese text.
function to_html(text: string): string {
	const raw = marked.parse(text, { async: false, gfm: true })
	const clean = DOMPurify.sanitize(raw)

	return repair_links(clean)
}

const markdown = { to_html }

export { markdown }
