import DOMPurify from 'dompurify'
import { marked } from 'marked'

// LLM answers are untrusted input rendered via {@html}; every link must open safely in a new tab.
function harden_link(node: Element): void {
	if (node.tagName !== 'A') return

	node.setAttribute('target', '_blank')
	node.setAttribute('rel', 'noopener noreferrer')
}

// DOMPurify only works where a DOM exists (browser + jsdom tests), not during Workers SSR — and
// to_html is only ever called client-side, so registering the hook behind a window guard is safe.
if ('window' in globalThis) {
	DOMPurify.addHook('afterSanitizeAttributes', harden_link)
}

// Render Markdown from the AI chat model to HTML. marked handles the Markdown; DOMPurify strips any
// unsafe HTML the model may emit (scripts, event handlers, javascript: URLs) before {@html} renders.
function to_html(text: string): string {
	const raw = marked.parse(text, { async: false, gfm: true })

	return DOMPurify.sanitize(raw)
}

const markdown = { to_html }

export { markdown }
