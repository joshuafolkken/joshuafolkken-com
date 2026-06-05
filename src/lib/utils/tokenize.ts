const BIGRAM_SIZE = 2

const LETTER_NUMBER_RUN = /[\p{L}\p{N}]+/gu
const ASCII_OR_OTHER_SEGMENT = /[a-z0-9]+|[^a-z0-9]+/gu
const ASCII_SEGMENT = /^[a-z0-9]+$/u

function to_bigrams(segment: string): Array<string> {
	if (segment.length <= 1) return segment ? [segment] : []

	const grams: Array<string> = []

	for (let index = 0; index + BIGRAM_SIZE <= segment.length; index++) {
		grams.push(segment.slice(index, index + BIGRAM_SIZE))
	}

	return grams
}

function segment_to_tokens(segment: string): Array<string> {
	return ASCII_SEGMENT.test(segment) ? [segment] : to_bigrams(segment)
}

function run_to_tokens(run: string): Array<string> {
	const segments = run.match(ASCII_OR_OTHER_SEGMENT) ?? []

	return segments.flatMap((segment) => segment_to_tokens(segment))
}

// Bigram tokenizer: ASCII words stay whole; CJK runs split into 2-grams so
// space-less Japanese text becomes searchable. Shared by index and query.
function tokenize(text: string): Array<string> {
	const runs = text.toLowerCase().match(LETTER_NUMBER_RUN) ?? []

	return runs.flatMap((run) => run_to_tokens(run))
}

const search_tokenizer = {
	tokenize,
}

export { search_tokenizer }
