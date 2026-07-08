import { afterEach, describe, expect, it, vi } from 'vitest'
import { chat_api } from './chat-api'
import type { ChatRequestMessage } from './chat-history'

const DELTA = ' {"choices":[{"delta":{"content":"Hello"}}]}'
const EVENT_STREAM = 'text/event-stream'
const JSON_TYPE = 'application/json'
const CONTENT_TYPE_HEADER = 'content-type'
const MESSAGES: Array<ChatRequestMessage> = [
	{ role: 'user', content: 'first' },
	{ role: 'assistant', content: 'answer' },
	{ role: 'user', content: 'q' },
]
const SERVER_ERROR_STATUS = 500
const SERVER_ERROR_DETAIL = 'ai search down'

function make_stream(body: string): ReadableStream<Uint8Array> {
	return new ReadableStream({
		start(controller) {
			controller.enqueue(new TextEncoder().encode(body))
			controller.close()
		},
	})
}

function stub_fetch(response: Response): ReturnType<typeof vi.fn> {
	const fetch_mock = vi.fn().mockResolvedValue(response)

	vi.stubGlobal('fetch', fetch_mock)

	return fetch_mock
}

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('chat_api.parse_delta', () => {
	it('extracts the delta content from an SSE data payload', () => {
		expect(chat_api.parse_delta(DELTA)).toBe('Hello')
	})

	it('returns undefined for the done marker, empty input and malformed json', () => {
		expect(chat_api.parse_delta(' [DONE]')).toBeUndefined()
		expect(chat_api.parse_delta(' '.repeat(3))).toBeUndefined()
		expect(chat_api.parse_delta('{not json')).toBeUndefined()
	})

	it('returns undefined when there is no content field', () => {
		expect(chat_api.parse_delta('{"choices":[{"delta":{}}]}')).toBeUndefined()
	})
})

describe('chat_api.ask', () => {
	it('posts the conversation history in the request body', async () => {
		const fetch_mock = stub_fetch(
			Response.json({ grounded: false }, { headers: { [CONTENT_TYPE_HEADER]: JSON_TYPE } }),
		)

		await chat_api.ask(MESSAGES, vi.fn())

		const [, init] = fetch_mock.mock.calls[0] as [string, RequestInit]

		expect(JSON.parse(init.body as string)).toEqual({ messages: MESSAGES })
	})

	it('returns grounded:false when the endpoint responds with json', async () => {
		stub_fetch(
			Response.json({ grounded: false }, { headers: { [CONTENT_TYPE_HEADER]: JSON_TYPE } }),
		)

		const on_token = vi.fn()
		const outcome = await chat_api.ask(MESSAGES, on_token)

		expect(outcome.grounded).toBe(false)
		expect(on_token).not.toHaveBeenCalled()
	})

	it('throws when the response is not ok', async () => {
		stub_fetch(new Response('', { status: SERVER_ERROR_STATUS }))

		await expect(chat_api.ask(MESSAGES, vi.fn())).rejects.toThrow()
	})
})

describe('chat_api.ask error responses', () => {
	it('surfaces the status code and server error detail as-is when the response fails', async () => {
		stub_fetch(
			Response.json(
				{ error: SERVER_ERROR_DETAIL },
				{ status: SERVER_ERROR_STATUS, headers: { [CONTENT_TYPE_HEADER]: JSON_TYPE } },
			),
		)

		await expect(chat_api.ask(MESSAGES, vi.fn())).rejects.toThrow(
			`[${String(SERVER_ERROR_STATUS)}] ${SERVER_ERROR_DETAIL}`,
		)
	})

	it('falls back to just the status code when the failure body has no detail', async () => {
		stub_fetch(new Response('', { status: SERVER_ERROR_STATUS }))

		await expect(chat_api.ask(MESSAGES, vi.fn())).rejects.toThrow(
			`[${String(SERVER_ERROR_STATUS)}]`,
		)
	})
})

describe('chat_api.ask streaming', () => {
	it('streams tokens and returns grounded:true for an event stream', async () => {
		const body = `data:${DELTA}\n\ndata: [DONE]\n\n`

		stub_fetch(
			new Response(make_stream(body), { headers: { [CONTENT_TYPE_HEADER]: EVENT_STREAM } }),
		)

		const tokens: Array<string> = []
		const outcome = await chat_api.ask(MESSAGES, (text) => {
			tokens.push(text)
		})

		expect(outcome.grounded).toBe(true)
		expect(tokens.join('')).toBe('Hello')
	})

	it('emits a final data line that is not terminated by a newline', async () => {
		stub_fetch(
			new Response(make_stream(`data:${DELTA}`), {
				headers: { [CONTENT_TYPE_HEADER]: EVENT_STREAM },
			}),
		)

		const tokens: Array<string> = []

		await chat_api.ask(MESSAGES, (text) => {
			tokens.push(text)
		})

		expect(tokens.join('')).toBe('Hello')
	})
})
