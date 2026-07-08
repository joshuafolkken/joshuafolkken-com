import type { ChatRequestMessage } from '$lib/api/chat-history'

// The generation model, retrieval thresholds, and system prompt stay on the AI Search instance
// (dashboard) — the single source of truth. Overriding *those* in code diverged production from the
// Playground (Japanese answered in English, no citations); see #675, so they are left untouched.
//
// Query rewrite is the deliberate exception: the instance exposes no dashboard toggle for it, so it
// is enabled here. It only reshapes the retrieval query — condensing the conversation history in
// `messages` into a standalone question so a follow-up ("それはどういうこと？") resolves against prior
// turns — and touches neither the model nor the system prompt, staying clear of the #675
// generation-side divergence; see #682.
//
// A single retrieval per request: chatCompletions retrieves and generates in one pass, so grounding
// is decided by the same search that produces the answer (no separate pre-stream search that could
// diverge from it) and off-topic questions are handled in-band by the dashboard system prompt; #665.
const AI_SEARCH_OPTIONS = { query_rewrite: { enabled: true } }

async function stream_answer(
	ai_search: AiSearchInstance,
	messages: Array<ChatRequestMessage>,
): Promise<ReadableStream> {
	return await ai_search.chatCompletions({
		messages,
		stream: true,
		ai_search_options: AI_SEARCH_OPTIONS,
	})
}

const chat = {
	stream_answer,
}

export { chat }
