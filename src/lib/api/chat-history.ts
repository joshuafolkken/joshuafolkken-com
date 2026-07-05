import type { ChatMessage, ChatRole } from '$lib/hooks/chat-log-payload'

// Follow-up questions ("それはどういうこと？") only resolve when the model sees the earlier turns they
// refer back to, so a trimmed window of recent history rides with each request. The window is bounded
// to keep token cost, latency, and off-topic noise flat however long the conversation grows.
const MAX_HISTORY_MESSAGES = 8
// A long prior answer only needs to seed the follow-up's context; sending it whole would inflate every
// later request. Cap each turn well under the server limit so a verbose answer never rejects the reply.
const MAX_CONTENT_CHARS = 4000

interface ChatRequestMessage {
	role: ChatRole
	content: string
}

function to_request_message(message: ChatMessage): ChatRequestMessage {
	return { role: message.role, content: message.text.slice(0, MAX_CONTENT_CHARS) }
}

// AI Search anchors its rewritten retrieval query on the first user turn, so a sliced window that
// happens to start on an assistant turn is trimmed from the front until a user message leads.
function drop_leading_assistant(messages: Array<ChatRequestMessage>): Array<ChatRequestMessage> {
	const first_user = messages.findIndex((message) => message.role === 'user')

	return first_user === -1 ? [] : messages.slice(first_user)
}

function build_request_messages(log: Array<ChatMessage>): Array<ChatRequestMessage> {
	// Empty-text entries (the in-progress assistant placeholder) carry nothing to ground on.
	const settled = log.filter((message) => message.text.length > 0)
	const windowed = settled
		.slice(-MAX_HISTORY_MESSAGES)
		.map((message) => to_request_message(message))

	return drop_leading_assistant(windowed)
}

const chat_history = { build_request_messages, MAX_HISTORY_MESSAGES, MAX_CONTENT_CHARS }

export { chat_history }
export type { ChatRequestMessage }
