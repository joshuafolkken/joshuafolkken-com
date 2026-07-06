import { CHAT_LABELS } from '$lib/constants/chat'
import type { ChatMessage, ChatRole } from '$lib/hooks/chat-log-payload'

// Follow-up questions ("それはどういうこと？") only resolve when the model sees the earlier turns they
// refer back to, so a trimmed window of recent history rides with each request. The window is bounded
// to keep token cost, latency, and off-topic noise flat however long the conversation grows.
const MAX_HISTORY_MESSAGES = 4
// A long prior answer only needs to seed the follow-up's context; sending it whole would inflate every
// later request. Cap each turn well under the server limit so a verbose answer never rejects the reply.
const MAX_CONTENT_CHARS = 2000
// Client-side status turns the user saw but the model never produced; replaying them as assistant
// history would pollute query rewrite and grounding, so they are dropped alongside empty placeholders.
const STATUS_LABELS = new Set<string>([CHAT_LABELS.NOT_FOUND, CHAT_LABELS.ERROR])

interface ChatRequestMessage {
	role: ChatRole
	content: string
}

function to_request_message(message: ChatMessage): ChatRequestMessage {
	return { role: message.role, content: message.text.slice(0, MAX_CONTENT_CHARS) }
}

function is_history_turn(message: ChatMessage): boolean {
	if (message.text.length === 0) return false

	return message.role !== 'assistant' || !STATUS_LABELS.has(message.text)
}

// AI Search anchors its rewritten retrieval query on the first user turn, so a sliced window that
// happens to start on an assistant turn is trimmed from the front until a user message leads.
function drop_leading_assistant(messages: Array<ChatRequestMessage>): Array<ChatRequestMessage> {
	const first_user = messages.findIndex((message) => message.role === 'user')

	return first_user === -1 ? [] : messages.slice(first_user)
}

function build_request_messages(log: Array<ChatMessage>): Array<ChatRequestMessage> {
	const settled = log.filter((message) => is_history_turn(message))
	const windowed = settled
		.slice(-MAX_HISTORY_MESSAGES)
		.map((message) => to_request_message(message))

	return drop_leading_assistant(windowed)
}

const chat_history = { build_request_messages, MAX_HISTORY_MESSAGES, MAX_CONTENT_CHARS }

export { chat_history }
export type { ChatRequestMessage }
