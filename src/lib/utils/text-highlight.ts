interface HighlightSegment {
	text: string
	is_match: boolean
}

function push_segment(segments: Array<HighlightSegment>, text: string, is_match: boolean): void {
	if (text) segments.push({ text, is_match })
}

function match_indices(haystack: string, needle: string): Array<number> {
	const indices: Array<number> = []

	let found = haystack.indexOf(needle)

	while (found !== -1) {
		indices.push(found)
		found = haystack.indexOf(needle, found + needle.length)
	}

	return indices
}

function build_segments(text: string, query: string): Array<HighlightSegment> {
	const indices = match_indices(text.toLowerCase(), query.toLowerCase())
	const segments: Array<HighlightSegment> = []

	let cursor = 0

	for (const start of indices) {
		push_segment(segments, text.slice(cursor, start), false)
		push_segment(segments, text.slice(start, start + query.length), true)
		cursor = start + query.length
	}

	push_segment(segments, text.slice(cursor), false)

	return segments
}

// Split text into matched / unmatched runs of the raw query substring so the UI
// can wrap matches in <mark> without using {@html} (DOM manipulation is restricted).
function highlight(text: string, query: string): Array<HighlightSegment> {
	const trimmed = query.trim()
	if (!trimmed) return [{ text, is_match: false }]

	return build_segments(text, trimmed)
}

const text_highlight = {
	highlight,
}

export type { HighlightSegment }
export { text_highlight }
