import { browser } from '$app/environment'
import { logger } from '$lib/logger'
import { chat_log_payload, type ChatMessage } from './chat-log-payload'

const STORAGE_KEY = 'chat_log'
// Combined cap across both roles; the oldest messages are trimmed once exceeded.
const MAX_MESSAGES = 100

function load_from_storage(): Array<ChatMessage> {
	if (!browser) return []

	const stored = localStorage.getItem(STORAGE_KEY)
	if (!stored) return []

	return chat_log_payload.parse(stored)
}

function save_to_storage(serialized: string): void {
	if (!browser) return

	try {
		localStorage.setItem(STORAGE_KEY, serialized)
	} catch (error) {
		logger.error('Failed to save chat log:', error)
	}
}

// Module-level singleton so the conversation survives client-side navigation, backed by
// localStorage so it also survives a full page reload and even closing the tab.
class ChatStateStore {
	#messages = $state<Array<ChatMessage>>([])

	constructor() {
		this.#messages = load_from_storage()

		let is_initialized = false

		$effect.root(() => {
			$effect(() => {
				// Serializing here deep-reads every message so in-place mutations are tracked — one pass, no clone.
				const serialized = JSON.stringify(this.#messages)

				if (is_initialized) {
					save_to_storage(serialized)
				} else {
					is_initialized = true
				}
			})
		})
	}

	#enforce_limit(): void {
		const overflow = this.#messages.length - MAX_MESSAGES

		if (overflow > 0) this.#messages.splice(0, overflow)
	}

	get_messages(): Array<ChatMessage> {
		return this.#messages
	}

	start_exchange(question: string): number {
		this.#messages.push({ role: 'user', text: question }, { role: 'assistant', text: '' })
		this.#enforce_limit()

		return this.#messages.length - 1
	}

	append(index: number, token: string): void {
		const message = this.#messages[index]

		if (message) message.text += token
	}

	set(index: number, text: string): void {
		const message = this.#messages[index]

		if (message) message.text = text
	}

	set_if_empty(index: number, text: string): void {
		const message = this.#messages[index]

		if (message?.text === '') message.text = text
	}

	reset(): void {
		this.#messages.length = 0
	}
}

const chat_state = new ChatStateStore()

export { chat_state }
