// Generation model, retrieval thresholds, query rewrite, and the system prompt are configured on
// the AI Search instance (dashboard) — the single source of truth. Overriding them here diverged
// production from the Playground (Japanese questions answered in English, no citations); see #675.
//
// A single retrieval per request: chatCompletions retrieves and generates in one pass, so grounding
// is decided by the same search that produces the answer (no separate pre-stream search that could
// diverge from it) and off-topic questions are handled in-band by the dashboard system prompt; #665.
async function stream_answer(
	ai_search: AiSearchInstance,
	question: string,
): Promise<ReadableStream> {
	return await ai_search.chatCompletions({
		messages: [{ role: 'user', content: question }],
		stream: true,
	})
}

const chat = {
	stream_answer,
}

export { chat }
