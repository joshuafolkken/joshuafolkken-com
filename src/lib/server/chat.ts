// Generation model, retrieval thresholds, query rewrite, and the system prompt are configured on
// the AI Search instance (dashboard) — the single source of truth. Overriding them here diverged
// production from the Playground (Japanese questions answered in English, no citations); see #675.
type SearchChunks = AiSearchSearchResponse['chunks']

async function retrieve(ai_search: AiSearchInstance, question: string): Promise<SearchChunks> {
	const { chunks } = await ai_search.search({ query: question })

	return chunks
}

function is_grounded(chunks: SearchChunks): boolean {
	return chunks.length > 0
}

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
	retrieve,
	is_grounded,
	stream_answer,
}

export { chat }
