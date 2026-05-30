const FRONTMATTER_PATTERN = /^---[\S\s]*?---/u
const FENCED_CODE_PATTERN = /```[\S\s]*?```/gu
const INLINE_CODE_PATTERN = /`[^`]*`/gu
const IMAGE_PATTERN = /!\[[^\]]*\]\([^)]*\)/gu
// Linear-time pattern over trusted build-time markdown, so ReDoS does not apply.
// eslint-disable-next-line sonarjs/slow-regex -- see note above
const LINK_PATTERN = /\[([^\]]*)\]\([^)]*\)/gu
const MARKDOWN_SYMBOL_PATTERN = /[#*>_`~-]/gu

// Counts CJK characters (Han / Hiragana / Katakana) so Japanese posts are
// measured fairly, unlike whitespace-based word counting.
const CJK_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu
const LATIN_WORD_PATTERN = /[\dA-Za-z]+(?:['’-][\dA-Za-z]+)*/gu

function to_plain_text(markdown: string): string {
	return markdown
		.replace(FRONTMATTER_PATTERN, ' ')
		.replaceAll(FENCED_CODE_PATTERN, ' ')
		.replaceAll(INLINE_CODE_PATTERN, ' ')
		.replaceAll(IMAGE_PATTERN, ' ')
		.replaceAll(LINK_PATTERN, '$1') // keep visible link text, drop the URL
		.replaceAll(MARKDOWN_SYMBOL_PATTERN, ' ')
}

// Returns a language-aware content length: CJK character count plus Latin word
// tokens. Used to decide whether a post has enough substance to carry ads.
function measure(markdown: string): number {
	const text = to_plain_text(markdown)
	const cjk_count = text.match(CJK_PATTERN)?.length ?? 0
	const latin_count = text.match(LATIN_WORD_PATTERN)?.length ?? 0

	return cjk_count + latin_count
}

export const content_length = { measure }
