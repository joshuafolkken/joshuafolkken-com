import { describe, expect, it, vi } from 'vitest'
import { chat } from './chat'

const QUERY = 'q'

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
