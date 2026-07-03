import { beforeEach, describe, expect, it } from 'vitest'
import { chat_state } from './ChatState.svelte'

const MAX_MESSAGES = 100

function seed_exchanges(count: number): void {
	for (let index = 0; index < count; index += 1) {
		chat_state.start_exchange(`q${String(index)}`)
	}
}

beforeEach(() => {
	chat_state.reset()
})

describe('chat_state messages', () => {
	it('start_exchange adds a user + empty assistant message and returns the assistant index', () => {
		const index = chat_state.start_exchange('hi')
		const messages = chat_state.get_messages()

		expect(messages).toHaveLength(2)
		expect(messages[0]).toEqual({ role: 'user', text: 'hi' })
		expect(messages[1]).toEqual({ role: 'assistant', text: '' })
		expect(index).toBe(1)
	})

	it('append accumulates tokens and set replaces the text at the index', () => {
		const index = chat_state.start_exchange('hi')

		chat_state.append(index, 'ans')
		chat_state.append(index, 'wer')
		expect(chat_state.get_messages()[index]?.text).toBe('answer')

		chat_state.set(index, 'replaced')
		expect(chat_state.get_messages()[index]?.text).toBe('replaced')
	})

	it('reset clears the conversation', () => {
		chat_state.start_exchange('hi')
		chat_state.reset()

		expect(chat_state.get_messages()).toHaveLength(0)
	})
})

describe('chat_state set_if_empty', () => {
	it('sets the text only when the message at the index is empty', () => {
		const index = chat_state.start_exchange('hi')

		chat_state.set_if_empty(index, 'fallback')
		expect(chat_state.get_messages()[index]?.text).toBe('fallback')

		chat_state.set_if_empty(index, 'other')
		expect(chat_state.get_messages()[index]?.text).toBe('fallback')
	})
})

describe('chat_state cap', () => {
	it('caps the combined log at 100 messages, trimming the oldest exchanges', () => {
		seed_exchanges(60)

		const messages = chat_state.get_messages()

		expect(messages).toHaveLength(MAX_MESSAGES)
		expect(messages[0]).toEqual({ role: 'user', text: 'q10' })
		expect(messages.at(-2)).toEqual({ role: 'user', text: 'q59' })
	})

	it('keeps the returned index valid after trimming to the cap', () => {
		seed_exchanges(60)

		const index = chat_state.start_exchange('latest')

		chat_state.append(index, 'answer')

		expect(chat_state.get_messages()[index]).toEqual({ role: 'assistant', text: 'answer' })
	})
})
