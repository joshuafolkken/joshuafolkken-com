import { describe, expect, it, vi } from 'vitest'
import { chat } from './chat'

const QUERY = 'q'
const SCORE = 0.8

type SearchChunk = AiSearchSearchResponse['chunks'][number]

function make_chunk(score: number): SearchChunk {
	return { id: 'c', type: 'text', score, text: 'body', item: { key: 'k' } }
}

describe('chat.is_grounded', () => {
	it('is false for no chunks', () => {
		expect(chat.is_grounded([])).toBe(false)
	})

	it('is true when at least one chunk is returned', () => {
		expect(chat.is_grounded([make_chunk(SCORE)])).toBe(true)
	})
})

describe('chat.retrieve', () => {
	it('returns chunks and searches with only the query, deferring options to the dashboard', async () => {
		const search = vi.fn().mockResolvedValue({ search_query: QUERY, chunks: [make_chunk(SCORE)] })
		const instance = { search }

		const chunks = await chat.retrieve(instance as unknown as AiSearchInstance, QUERY)

		expect(chunks).toHaveLength(1)
		expect(search).toHaveBeenCalledWith({ query: QUERY })
	})
})

describe('chat.stream_answer', () => {
	it('requests a streaming completion without overriding the dashboard model or options', async () => {
		const stream = new ReadableStream()
		const chat_completions = vi.fn().mockResolvedValue(stream)
		const instance = { chatCompletions: chat_completions }

		const result = await chat.stream_answer(instance as unknown as AiSearchInstance, QUERY)

		expect(chat_completions).toHaveBeenCalledWith({
			messages: [{ role: 'user', content: QUERY }],
			stream: true,
		})

		const [request] = chat_completions.mock.calls[0] as [Record<string, unknown>]

		expect(request).not.toHaveProperty('model')
		expect(request).not.toHaveProperty('ai_search_options')
		expect(result).toBe(stream)
	})
})
