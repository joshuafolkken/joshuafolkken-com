import DOMPurify from 'dompurify'
import { marked, type TokenizerAndRendererExtension, type Tokens } from 'marked'
import { markup } from './escape'

// A URL written in Markdown is ASCII, so the first non-ASCII character marks where the following
// Japanese text — a sentence, or punctuation that ends one — begins.
const NON_ASCII = /\P{ASCII}/u

// Match a bare URL only up to the first non-ASCII character (lookahead). marked's built-in url tokenizer
// uses [^\s<]*, and because Japanese has no ASCII spaces it swallows the following sentence (and any
// later URL) into the href. This fires only when a URL is immediately followed by non-ASCII text; every
// other URL falls through to marked's built-in url tokenizer, keeping its email/trailing-punctuation handling.
const URL_BEFORE_NON_ASCII = /^(https?:\/\/[^\s<]*?)(?=\P{ASCII})/u

function safe_decode(value: string): string {
	try {
		return decodeURIComponent(value)
	} catch {
		return value
	}
}

// marked percent-encodes non-ASCII href characters, so decode before checking for leaked sentence text.
function has_leaked_text(href: string): boolean {
	return NON_ASCII.test(safe_decode(href))
}

function bounded_url_start(source: string): number | undefined {
	return /https?:\/\//u.exec(source)?.index
}

function bounded_url_tokenizer(source: string): Tokens.Generic | undefined {
	const match = URL_BEFORE_NON_ASCII.exec(source)
	if (!match) return undefined

	const [, href] = match
	if (href === undefined) return undefined

	return {
		type: 'link',
		raw: href,
		href,
		text: href,
		tokens: [{ type: 'text', raw: href, text: href }],
	}
}

// Bound bare URLs at the first CJK character so a following Japanese sentence stays out of the href.
const bounded_url_extension: TokenizerAndRendererExtension = {
	name: 'cjkBoundedUrl',
	level: 'inline',
	start: bounded_url_start,
	tokenizer: bounded_url_tokenizer,
}

// A code span whose whole content is a bare URL, or a [label](url) markdown link. The model often cites
// documents inside backticks, where the URL is inert; linkify those so the citation stays clickable.
const CODE_URL = /^(https?:\/\/[^\s<]+)$/u
const CODE_MD_LINK = /^\[([^\]]+)\]\((https?:\/\/[^\s<)]+)\)$/u

// marked 18 hands the codespan renderer the raw code text, so escape it with the shared markup helper —
// which encodes every &, < > " ' exactly as marked's default codespan does — before it reaches {@html}.
function linked_code(href: string, label: string): string {
	return `<code><a href="${markup.escape(href)}">${markup.escape(label)}</a></code>`
}

function url_code_link(text: string): string | undefined {
	const match = CODE_URL.exec(text)
	if (!match) return undefined

	return match[1]
}

function md_code_link(text: string): [string, string] | undefined {
	const match = CODE_MD_LINK.exec(text)
	if (!match) return undefined

	const [, label, href] = match
	if (label === undefined || href === undefined) return undefined

	return [href, label]
}

// Keep the code styling but make the URL/link clickable; every non-link code span renders exactly as
// marked's default. harden_link (below) later adds target/rel and drops any leaked-text href.
function codespan_html(text: string): string {
	const url = url_code_link(text)
	if (url) return linked_code(url, url)

	const md_link = md_code_link(text)
	if (md_link) return linked_code(md_link[0], md_link[1])

	return `<code>${markup.escape(text)}</code>`
}

function codespan_renderer(token: Tokens.Codespan): string {
	return codespan_html(token.text)
}

// LLM answers are untrusted input rendered via {@html}; every link must open safely in a new tab. An
// inline [label](target) link whose target absorbed a sentence (the tokenizer above only covers bare
// URLs) has an unusable href, so drop it — the label stays as text and no link points at garbage.
function harden_link(node: Element): void {
	if (node.tagName !== 'A') return

	node.setAttribute('target', '_blank')
	node.setAttribute('rel', 'noopener noreferrer')

	const href = node.getAttribute('href')
	if (href && has_leaked_text(href)) node.removeAttribute('href')
}

// DOMPurify only works where a DOM exists (browser + jsdom tests), not during Workers SSR — and
// to_html is only ever called client-side, so registering the hook behind a window guard is safe.
if ('window' in globalThis) {
	DOMPurify.addHook('afterSanitizeAttributes', harden_link)
	marked.use({ extensions: [bounded_url_extension], renderer: { codespan: codespan_renderer } })
}

// Render Markdown from the AI chat model to HTML. The bounded_url extension keeps marked from swallowing
// Japanese text into bare-url hrefs; marked renders the rest, and DOMPurify strips unsafe HTML (scripts,
// event handlers, javascript: URLs) and drops any leftover leaked-href link before {@html} renders it.
function to_html(text: string): string {
	const raw = marked.parse(text, { async: false, gfm: true })

	return DOMPurify.sanitize(raw)
}

const markdown = { to_html }

export { markdown }
