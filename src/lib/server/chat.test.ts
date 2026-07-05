import type { ChatRequestMessage } from '$lib/api/chat-history'
import { describe, expect, it, vi } from 'vitest'
import { chat } from './chat'

const MESSAGES: Array<ChatRequestMessage> = [
	{ role: 'user', content: 'first question' },
	{ role: 'assistant', content: 'first answer' },
	{ role: 'user', content: 'follow-up' },
]

describe('chat.stream_answer', () => {
	it('forwards history and enables query rewrite without overriding the dashboard model', async () => {
		const stream = new ReadableStream()
		const chat_completions = vi.fn().mockResolvedValue(stream)
		const instance = { chatCompletions: chat_completions }

		const result = await chat.stream_answer(instance as unknown as AiSearchInstance, MESSAGES)

		expect(chat_completions).toHaveBeenCalledWith({
			messages: MESSAGES,
			stream: true,
			ai_search_options: { query_rewrite: { enabled: true } },
		})

		const [request] = chat_completions.mock.calls[0] as [Record<string, unknown>]

		// The model and system prompt stay on the dashboard; only query rewrite is set in code (#675).
		expect(request).not.toHaveProperty('model')
		expect(result).toBe(stream)
	})
})
