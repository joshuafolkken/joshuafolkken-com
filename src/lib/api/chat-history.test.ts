import type { ChatMessage } from '$lib/hooks/chat-log-payload'
import { describe, expect, it } from 'vitest'
import { chat_history } from './chat-history'

function user(text: string): ChatMessage {
	return { role: 'user', text }
}

function assistant(text: string): ChatMessage {
	return { role: 'assistant', text }
}

// Alternating user/assistant turns (u0, a1, u2, …) for exercising the window bounds.
function alternating_log(count: number): Array<ChatMessage> {
	return Array.from({ length: count }, (_unused, index) =>
		index % 2 === 0 ? user(`u${String(index)}`) : assistant(`a${String(index)}`),
	)
}

describe('chat_history.build_request_messages', () => {
	it('maps log text to request content and preserves order', () => {
		const log = [user('one'), assistant('two'), user('three')]

		expect(chat_history.build_request_messages(log)).toEqual([
			{ role: 'user', content: 'one' },
			{ role: 'assistant', content: 'two' },
			{ role: 'user', content: 'three' },
		])
	})

	it('excludes the in-progress empty assistant placeholder', () => {
		const log = [user('question'), assistant('')]

		expect(chat_history.build_request_messages(log)).toEqual([
			{ role: 'user', content: 'question' },
		])
	})

	it('returns an empty list when no user message is present', () => {
		expect(chat_history.build_request_messages([assistant('a1'), assistant('a2')])).toEqual([])
	})
})

describe('chat_history.build_request_messages window bounds', () => {
	it('keeps only the most recent MAX_HISTORY_MESSAGES entries', () => {
		const result = chat_history.build_request_messages(alternating_log(20))

		expect(result).toHaveLength(chat_history.MAX_HISTORY_MESSAGES)
		expect(result.at(-1)).toEqual({ role: 'assistant', content: 'a19' })
	})

	it('drops leading assistant turns so the window starts with a user message', () => {
		// Nine turns: slice(-8) begins on a1 (an assistant turn), which must be trimmed off the front.
		const result = chat_history.build_request_messages(alternating_log(9))

		expect(result.at(0)).toEqual({ role: 'user', content: 'u2' })
		expect(result.every((message, index) => index > 0 || message.role === 'user')).toBe(true)
	})

	it('truncates an over-long turn so a verbose prior answer never bloats the request', () => {
		const long_answer = 'a'.repeat(chat_history.MAX_CONTENT_CHARS + 500)
		const log = [user('q'), assistant(long_answer), user('follow-up')]

		const result = chat_history.build_request_messages(log)

		expect(result[1]?.content).toHaveLength(chat_history.MAX_CONTENT_CHARS)
	})
})
