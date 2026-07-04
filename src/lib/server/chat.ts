const MATCH_THRESHOLD = 0.3
const GROUNDING_THRESHOLD = 0.3
const MAX_NUM_RESULTS = 8
// Qwen3 MoE (3B active): strong Japanese with ~1/6.7 the output Neurons of the 70B default (see #668).
const GENERATION_MODEL = '@cf/qwen/qwen3-30b-a3b-fp8'

const STRICT_GROUNDING_PROMPT =
	'You are the assistant for the joshuafolkken.com website. ' +
	'Answer only using the retrieved context from this site. ' +
	'If the answer is not in the context, say you could not find it and suggest rephrasing or contacting the author. ' +
	'Never use outside knowledge and never guess. Reply in the same language as the question.'

type SearchChunks = AiSearchSearchResponse['chunks']

function retrieval_options(): AiSearchOptions {
	return {
		retrieval: {
			max_num_results: MAX_NUM_RESULTS,
			match_threshold: MATCH_THRESHOLD,
		},
		query_rewrite: { enabled: true },
	}
}

async function retrieve(ai_search: AiSearchInstance, question: string): Promise<SearchChunks> {
	const { chunks } = await ai_search.search({
		query: question,
		ai_search_options: retrieval_options(),
	})

	return chunks
}

function is_grounded(chunks: SearchChunks, threshold: number = GROUNDING_THRESHOLD): boolean {
	const [top] = chunks

	return top !== undefined && top.score >= threshold
}

async function stream_answer(
	ai_search: AiSearchInstance,
	question: string,
): Promise<ReadableStream> {
	return await ai_search.chatCompletions({
		model: GENERATION_MODEL,
		messages: [
			{ role: 'system', content: STRICT_GROUNDING_PROMPT },
			{ role: 'user', content: question },
		],
		stream: true,
		ai_search_options: retrieval_options(),
	})
}

const chat = {
	retrieve,
	is_grounded,
	stream_answer,
}

export { chat }
