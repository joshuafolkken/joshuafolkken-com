import { browser } from '$app/environment'
import { logger } from '$lib/logger'
import { scheduling } from '$lib/utils/scheduling'
import { chat_log_payload, type ChatMessage } from './chat-log-payload'

const STORAGE_KEY = 'chat_log'
// Combined cap across both roles; the oldest messages are trimmed once exceeded.
const MAX_MESSAGES = 100
// A streamed reply mutates the log once per token; persisting inline would run a full JSON serialize
// plus a synchronous localStorage write per token. Debounce collapses each burst into one write.
const PERSIST_DEBOUNCE_MS = 300

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
	// Reassigned only here (at construction); afterwards it is mutated in place, so it is readonly.
	readonly #messages = $state<Array<ChatMessage>>(load_from_storage())
	// Each mutation schedules a debounced write instead of serializing per token; a burst of streamed
	// tokens becomes one write, and pagehide flushes any pending write so a closing tab keeps the log.
	readonly #persist = scheduling.debounce(() => {
		this.#write_now()
	}, PERSIST_DEBOUNCE_MS)

	constructor() {
		if (!browser) return

		// Flush any pending write before the tab goes away. pagehide covers reload / close / navigation;
		// visibilitychange additionally covers mobile backgrounding, where the tab can be evicted without
		// ever firing pagehide.
		window.addEventListener('pagehide', () => {
			this.#flush()
		})
		document.addEventListener('visibilitychange', () => {
			this.#flush()
		})
	}

	#flush(): void {
		this.#persist.flush()
	}

	#write_now(): void {
		save_to_storage(JSON.stringify(this.#messages))
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
		this.#persist.schedule()

		return this.#messages.length - 1
	}

	append(index: number, token: string): void {
		const message = this.#messages[index]

		if (!message) return

		message.text += token
		this.#persist.schedule()
	}

	set(index: number, text: string): void {
		const message = this.#messages[index]

		if (!message) return

		message.text = text
		this.#persist.schedule()
	}

	set_if_empty(index: number, text: string): void {
		const message = this.#messages[index]

		if (message?.text !== '') return

		message.text = text
		this.#persist.schedule()
	}

	reset(): void {
		this.#messages.length = 0
		this.#persist.cancel()
		this.#write_now()
	}
}

const chat_state = new ChatStateStore()

export { chat_state }
