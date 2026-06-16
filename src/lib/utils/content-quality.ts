/**
 * Minimum content length (CJK characters + Latin word tokens, measured with
 * `content_length.measure`) a blog post must reach to be treated as substantial.
 * Posts below this are low-value pages: they serve no ads AND are excluded from
 * indexing (robots noindex + sitemap), per Google AdSense content-quality
 * policy. This is the single source of truth for both gates — tune this one
 * value to move ads visibility and indexing together.
 */
const MIN_SUBSTANTIAL_CONTENT_LENGTH = 1200

function is_substantial(content_length: number): boolean {
	return content_length >= MIN_SUBSTANTIAL_CONTENT_LENGTH
}

const content_quality = { is_substantial }

export { MIN_SUBSTANTIAL_CONTENT_LENGTH, content_quality }
