// User-visible strings are centralized here (the project has no i18n runtime yet;
// constants are the established pattern — see $lib/constants/search.ts SEARCH_LABELS).
const CHAT_LABELS = {
	TITLE: 'AI Chat',
	DESCRIPTION: 'Ask about the author, projects, and blog posts.',
	PLACEHOLDER: 'Ask a question…',
	SEND: 'Send',
	ASK: 'Ask a question',
	THINKING: 'Thinking',
	NOT_FOUND:
		"I couldn't find that in the site content. Try rephrasing, or check the About and Blog pages.",
	ERROR: 'Something went wrong. Please try again.',
	CLEAR_COMMAND: '/clear',
} as const

export { CHAT_LABELS }
