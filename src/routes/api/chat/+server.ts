import { CONTENT_TYPE, ERROR_MESSAGES, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import { logger } from '$lib/logger'
import { chat } from '$lib/server/chat'
import { platform_binding } from '$lib/server/platform-binding'
import { security, type SecurityContext } from '$lib/server/security'
import type { RequestHandler } from './$types'

const MAX_QUESTION_LENGTH = 500

interface ChatRequestBody {
	question?: unknown
}

function is_chat_request_body(value: unknown): value is ChatRequestBody {
	return typeof value === 'object' && value !== null
}

function parse_question(value: unknown): string | undefined {
	if (!is_chat_request_body(value)) return undefined

	const { question } = value

	if (typeof question !== 'string') return undefined

	const trimmed = question.trim()

	return trimmed.length === 0 || trimmed.length > MAX_QUESTION_LENGTH ? undefined : trimmed
}

async function get_valid_question(request: Request): Promise<string | undefined> {
	if (!security.is_json_content_type(request)) return undefined

	try {
		return parse_question(await request.json())
	} catch {
		return undefined
	}
}

async function answer_question(
	question: string,
	platform: App.Platform | undefined,
): Promise<Response> {
	const ai_search = platform_binding.get_ai_search(platform)
	// Single retrieval: chatCompletions retrieves and generates in one pass. Grounding is no longer
	// gated by a separate pre-stream search; the dashboard system prompt answers "not found" in-band.
	const stream = await chat.stream_answer(ai_search, question)

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

	const question = await get_valid_question(request)

	if (!question) {
		return security.json_error(ERROR_MESSAGES.QUESTION_INVALID, HTTP_STATUS.BAD_REQUEST)
	}

	try {
		return await answer_question(question, platform)
	} catch (error) {
		logger.error(error)

		return security.json_error(ERROR_MESSAGES.FAILED_TO_ANSWER, HTTP_STATUS.INTERNAL_SERVER_ERROR)
	}
}
