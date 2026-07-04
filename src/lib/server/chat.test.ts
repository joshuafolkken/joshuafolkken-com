import { describe, expect, it, vi } from 'vitest'
import { chat } from './chat'

const QUERY = 'q'
const THRESHOLD = 0.5
const BELOW = 0.3
const ABOVE = 0.8
const FUZZY_MAX_RESULTS = 8
const FUZZY_MATCH_THRESHOLD = 0.3

type SearchChunk = AiSearchSearchResponse['chunks'][number]

function make_chunk(score: number): SearchChunk {
	return { id: 'c', type: 'text', score, text: 'body', item: { key: 'k' } }
}

describe('chat.is_grounded', () => {
	it('is false for no chunks', () => {
		expect(chat.is_grounded([])).toBe(false)
	})

	it('is false when the top score is below the threshold', () => {
		expect(chat.is_grounded([make_chunk(BELOW)], THRESHOLD)).toBe(false)
	})

	it('is true when the top score meets the threshold', () => {
		expect(chat.is_grounded([make_chunk(ABOVE)], THRESHOLD)).toBe(true)
	})
})

describe('chat.retrieve', () => {
	it('returns chunks and searches with fuzzy (query rewrite + low threshold) options', async () => {
		const search = vi.fn().mockResolvedValue({ search_query: QUERY, chunks: [make_chunk(ABOVE)] })
		const instance = { search }

		const chunks = await chat.retrieve(instance as unknown as AiSearchInstance, QUERY)

		expect(chunks).toHaveLength(1)
		expect(search).toHaveBeenCalledWith({
			query: QUERY,
			ai_search_options: {
				retrieval: {
					max_num_results: FUZZY_MAX_RESULTS,
					match_threshold: FUZZY_MATCH_THRESHOLD,
				},
				query_rewrite: { enabled: true },
			},
		})
	})
})

describe('chat.stream_answer', () => {
	it('requests a streaming chat completion and returns the stream', async () => {
		const stream = new ReadableStream()
		const chat_completions = vi.fn().mockResolvedValue(stream)
		const instance = { chatCompletions: chat_completions }

		const result = await chat.stream_answer(instance as unknown as AiSearchInstance, QUERY)

		expect(chat_completions).toHaveBeenCalledWith(
			expect.objectContaining({ model: '@cf/qwen/qwen3-30b-a3b-fp8', stream: true }),
		)
		expect(result).toBe(stream)
	})
})
