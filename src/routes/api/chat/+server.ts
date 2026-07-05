import { chat_history, type ChatRequestMessage } from '$lib/api/chat-history'
import { CONTENT_TYPE, ERROR_MESSAGES, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import { logger } from '$lib/logger'
import { chat } from '$lib/server/chat'
import { platform_binding } from '$lib/server/platform-binding'
import { security, type SecurityContext } from '$lib/server/security'
import type { RequestHandler } from './$types'

const MAX_QUESTION_LENGTH = 500
// A historical turn carries a full RAG answer, so it needs far more headroom than a user question:
// rejecting an over-long prior answer would break the very follow-up this feature enables. The cap
// still bounds abuse — worst case is MAX_MESSAGES × this many characters per request.
const MAX_MESSAGE_LENGTH = 8000
// Single-sourced from the client window so widening one never silently rejects the other's payload.
const MAX_MESSAGES = chat_history.MAX_HISTORY_MESSAGES

interface ChatRequestBody {
	messages?: unknown
}

function is_chat_request_body(value: unknown): value is ChatRequestBody {
	return typeof value === 'object' && value !== null
}

function has_message_fields(value: unknown): value is Record<'role' | 'content', unknown> {
	return typeof value === 'object' && value !== null
}

function is_role(value: unknown): boolean {
	return value === 'user' || value === 'assistant'
}

function is_content(value: unknown): boolean {
	return typeof value === 'string' && value.length > 0 && value.length <= MAX_MESSAGE_LENGTH
}

function is_request_message(item: unknown): item is ChatRequestMessage {
	return has_message_fields(item) && is_role(item.role) && is_content(item.content)
}

function has_valid_length(messages: Array<unknown>): boolean {
	return messages.length > 0 && messages.length <= MAX_MESSAGES
}

function is_message_list(value: unknown): value is Array<ChatRequestMessage> {
	return Array.isArray(value) && has_valid_length(value) && value.every(is_request_message)
}

// The final turn is the new question: it must come from the user and, once trimmed, be non-empty and
// within the question limit (matching the pre-history contract so a blank query never reaches AI Search).
function is_valid_question(messages: Array<ChatRequestMessage>): boolean {
	const last = messages.at(-1)

	if (last?.role !== 'user') return false

	const trimmed = last.content.trim()

	return trimmed.length > 0 && trimmed.length <= MAX_QUESTION_LENGTH
}

function parse_messages(value: unknown): Array<ChatRequestMessage> | undefined {
	if (!is_chat_request_body(value)) return undefined
	if (!is_message_list(value.messages)) return undefined
	if (!is_valid_question(value.messages)) return undefined

	return value.messages
}

async function get_valid_messages(
	request: Request,
): Promise<Array<ChatRequestMessage> | undefined> {
	if (!security.is_json_content_type(request)) return undefined

	try {
		return parse_messages(await request.json())
	} catch {
		return undefined
	}
}

async function answer_question(
	messages: Array<ChatRequestMessage>,
	platform: App.Platform | undefined,
): Promise<Response> {
	const ai_search = platform_binding.get_ai_search(platform)
	// Single retrieval: chatCompletions retrieves and generates in one pass. Grounding is no longer
	// gated by a separate pre-stream search; the dashboard system prompt answers "not found" in-band.
	const stream = await chat.stream_answer(ai_search, messages)

	return new Response(stream, {
		headers: { [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE.EVENT_STREAM },
	})
}

export const POST: RequestHandler = async ({
	request,
	getClientAddress: get_client_address,
	url,
	platform,
}) => {
	const context: SecurityContext = { request, url, ip: get_client_address(), platform }
	const error_response = await security.validate_request_security(context)

	if (error_response) return error_response

	const messages = await get_valid_messages(request)

	if (!messages) {
		return security.json_error(ERROR_MESSAGES.QUESTION_INVALID, HTTP_STATUS.BAD_REQUEST)
	}

	try {
		return await answer_question(messages, platform)
	} catch (error) {
		logger.error(error)

		return security.json_error(ERROR_MESSAGES.FAILED_TO_ANSWER, HTTP_STATUS.INTERNAL_SERVER_ERROR)
	}
}
