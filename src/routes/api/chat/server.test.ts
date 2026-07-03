import { HTTP_STATUS } from '$lib/constants/http'
import { chat } from '$lib/server/chat'
import { security } from '$lib/server/security'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './+server'

vi.mock('$lib/server/chat', () => ({
	chat: { retrieve: vi.fn(), is_grounded: vi.fn(), stream_answer: vi.fn() },
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
	vi.mocked(chat.retrieve).mockResolvedValue([])
	vi.mocked(chat.is_grounded).mockReturnValue(false)
})

describe('POST /api/chat', () => {
	it('propagates a security rejection', async () => {
		const rejection = Response.json({ error: 'Forbidden' }, { status: HTTP_STATUS.FORBIDDEN })

		vi.mocked(security.validate_request_security).mockResolvedValue(rejection)

		const response = await POST(make_post_event({ question: QUESTION }))

		expect(response.status).toBe(HTTP_STATUS.FORBIDDEN)
	})

	it('rejects an empty question', async () => {
		const response = await POST(make_post_event({ question: '' }))

		expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST)
	})

	it('returns not-grounded json when there is no relevant context', async () => {
		vi.mocked(chat.is_grounded).mockReturnValue(false)

		const response = await POST(make_post_event({ question: QUESTION }))
		const body = await response.json()

		expect(body).toEqual({ grounded: false })
		expect(chat.stream_answer).not.toHaveBeenCalled()
	})

	it('streams an answer when grounded', async () => {
		vi.mocked(chat.is_grounded).mockReturnValue(true)
		vi.mocked(chat.stream_answer).mockResolvedValue(new ReadableStream())

		const response = await POST(make_post_event({ question: QUESTION }))

		expect(response.headers.get('Content-Type')).toContain(EVENT_STREAM)
		expect(chat.stream_answer).toHaveBeenCalled()
	})
})
