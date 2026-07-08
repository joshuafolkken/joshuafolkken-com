import { HTTP_STATUS } from '$lib/constants/http'
import { chat } from '$lib/server/chat'
import { security } from '$lib/server/security'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './+server'

vi.mock('$lib/server/chat', () => ({
	chat: { stream_answer: vi.fn() },
}))

vi.mock('$lib/server/platform-binding', () => ({
	platform_binding: { get_ai_search: vi.fn(() => ({})) },
}))

vi.mock('$lib/server/security', () => ({
	security: {
		validate_request_security: vi.fn(),
		json_error: vi.fn((message: string, status: number) =>
			Response.json({ error: message }, { status }),
		),
		is_json_content_type: (request: Request) =>
			request.headers.get('content-type')?.startsWith('application/json') ?? false,
	},
}))

vi.mock('$lib/logger', () => ({
	logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}))

const CHAT_URL = 'http://localhost/api/chat'
const JSON_CONTENT_TYPE = 'application/json'
const QUESTION = 'Who is the author?'
const EVENT_STREAM = 'text/event-stream'
const VALID_MESSAGES = [
	{ role: 'user', content: 'Earlier question' },
	{ role: 'assistant', content: 'Earlier answer' },
	{ role: 'user', content: QUESTION },
]
const OVER_LENGTH_QUESTION = 'x'.repeat(501)
const WHITESPACE_QUESTION = ' '.repeat(3)
const STREAM_ERROR_DETAIL = 'ai search down'

function make_post_event(
	body: Record<string, unknown>,
	content_type = JSON_CONTENT_TYPE,
): Parameters<typeof POST>[0] {
	const url = new URL(CHAT_URL)
	const request = new Request(url.href, {
		method: 'POST',
		headers: { 'content-type': content_type },
		body: JSON.stringify(body),
	})

	const partial = { url, request, getClientAddress: () => '127.0.0.1', platform: undefined }

	return partial as unknown as Parameters<typeof POST>[0]
}

beforeEach(() => {
	vi.mocked(security.validate_request_security).mockResolvedValue(undefined)
	vi.mocked(chat.stream_answer).mockResolvedValue(new ReadableStream())
})

describe('POST /api/chat', () => {
	it('propagates a security rejection', async () => {
		const rejection = Response.json({ error: 'Forbidden' }, { status: HTTP_STATUS.FORBIDDEN })

		vi.mocked(security.validate_request_security).mockResolvedValue(rejection)

		const response = await POST(make_post_event({ messages: VALID_MESSAGES }))

		expect(response.status).toBe(HTTP_STATUS.FORBIDDEN)
	})

	it('streams the answer for a valid history, forwarding it with a single retrieval', async () => {
		const response = await POST(make_post_event({ messages: VALID_MESSAGES }))

		expect(response.headers.get('Content-Type')).toContain(EVENT_STREAM)
		// One generation call, no separate pre-stream grounding search: a single retrieval per request.
		expect(chat.stream_answer).toHaveBeenCalledOnce()
		expect(chat.stream_answer).toHaveBeenCalledWith(expect.anything(), VALID_MESSAGES)
	})

	it('returns a server error when the answer stream cannot be created', async () => {
		vi.mocked(chat.stream_answer).mockRejectedValue(new Error(STREAM_ERROR_DETAIL))

		const response = await POST(make_post_event({ messages: VALID_MESSAGES }))

		expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
	})

	it('surfaces the real error detail in the failure body', async () => {
		vi.mocked(chat.stream_answer).mockRejectedValue(new Error(STREAM_ERROR_DETAIL))

		const response = await POST(make_post_event({ messages: VALID_MESSAGES }))
		const body: unknown = await response.json()

		expect(body).toEqual({ error: STREAM_ERROR_DETAIL })
	})
})

describe('POST /api/chat validation', () => {
	it('rejects an empty message list', async () => {
		const response = await POST(make_post_event({ messages: [] }))

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
	})

	it('rejects a whitespace-only final question', async () => {
		const response = await POST(
			make_post_event({ messages: [{ role: 'user', content: WHITESPACE_QUESTION }] }),
		)

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
	})

	it('rejects when the final turn is not a user message', async () => {
		const response = await POST(
			make_post_event({ messages: [{ role: 'assistant', content: 'orphan reply' }] }),
		)

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
	})

	it('rejects when the final question exceeds the length limit', async () => {
		const response = await POST(
			make_post_event({ messages: [{ role: 'user', content: OVER_LENGTH_QUESTION }] }),
		)

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
	})
})
