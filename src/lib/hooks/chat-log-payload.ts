import { parse_json_array } from '$lib/utils/parse-json-array'

type ChatRole = 'user' | 'assistant'

interface ChatMessage {
	role: ChatRole
	text: string
	// ISO 8601 capture time; optional so pre-existing stored logs (written before this field) still parse.
	timestamp?: string
	// Technical failure detail (HTTP code + server message) shown as a sub-message under a friendly
	// error; optional so it is absent on every non-error message and on pre-existing stored logs.
	detail?: string
}

function has_message_fields(
	value: unknown,
): value is Record<'role' | 'text' | 'timestamp' | 'detail', unknown> {
	return typeof value === 'object' && value !== null
}

function is_role(value: unknown): value is ChatRole {
	return value === 'user' || value === 'assistant'
}

function is_optional_string(value: unknown): boolean {
	return value === undefined || typeof value === 'string'
}

function is_chat_message(item: unknown): item is ChatMessage {
	if (!has_message_fields(item)) return false

	return (
		is_role(item.role) &&
		typeof item.text === 'string' &&
		is_optional_string(item.timestamp) &&
		is_optional_string(item.detail)
	)
}

function parse(raw: string): Array<ChatMessage> {
	return parse_json_array(raw, is_chat_message, 'Failed to parse chat log:')
}

const chat_log_payload = { parse, is_role }

export { chat_log_payload }
export type { ChatMessage, ChatRole }
