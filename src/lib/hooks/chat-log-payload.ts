import { parse_json_array } from '$lib/utils/parse-json-array'

type ChatRole = 'user' | 'assistant'

interface ChatMessage {
	role: ChatRole
	text: string
}

function has_message_fields(value: unknown): value is Record<'role' | 'text', unknown> {
	return typeof value === 'object' && value !== null
}

function is_role(value: unknown): value is ChatRole {
	return value === 'user' || value === 'assistant'
}

function is_chat_message(item: unknown): item is ChatMessage {
	if (!has_message_fields(item)) return false

	return is_role(item.role) && typeof item.text === 'string'
}

function parse(raw: string): Array<ChatMessage> {
	return parse_json_array(raw, is_chat_message, 'Failed to parse chat log:')
}

const chat_log_payload = { parse }

export { chat_log_payload }
export type { ChatMessage, ChatRole }
