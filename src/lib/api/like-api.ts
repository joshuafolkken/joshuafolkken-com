import { APP } from '$lib/app'
import { CONTENT_TYPE_JSON, ERROR_MESSAGES, HTTP_HEADERS } from '$lib/constants/http'

interface LikeResponse {
	likes: number
}

const ERROR_INVALID_RESPONSE_FORMAT = 'Invalid response format'

function validate_like_response(data: unknown): data is LikeResponse {
	if (typeof data !== 'object' || data === null) return false

	const candidate = data as { likes?: unknown }

	return 'likes' in data && typeof candidate.likes === 'number'
}

async function handle_like_response(
	response: Response,
	error_message: string,
): Promise<LikeResponse> {
	if (!response.ok) {
		throw new Error(`${error_message}: ${String(response.status)}`)
	}

	const data: unknown = await response.json()

	if (!validate_like_response(data)) {
		throw new Error(ERROR_INVALID_RESPONSE_FORMAT)
	}

	return data
}

async function get(slug: string): Promise<LikeResponse> {
	const response = await fetch(`/api/like?slug=${encodeURIComponent(slug)}`, {
		headers: {
			[HTTP_HEADERS.X_APP_CLIENT]: APP.ID,
		},
	})

	return await handle_like_response(response, ERROR_MESSAGES.FAILED_TO_GET_LIKES)
}

async function increment(slug: string): Promise<LikeResponse> {
	const response = await fetch('/api/like', {
		method: 'POST',
		headers: {
			[HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE_JSON,
			[HTTP_HEADERS.X_APP_CLIENT]: APP.ID,
		},
		body: JSON.stringify({ slug }),
	})

	return await handle_like_response(response, ERROR_MESSAGES.FAILED_TO_INCREMENT_LIKES)
}

export const like_api = {
	get,
	increment,
}
