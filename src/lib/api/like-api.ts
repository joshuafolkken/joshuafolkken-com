import { APP } from '$lib/app'
import { HTTP_HEADERS } from '$lib/constants/http'

interface LikeResponse {
	likes: number
}

const ERROR_INVALID_RESPONSE_FORMAT = 'Invalid response format'

function validate_like_response(data: unknown): data is LikeResponse {
	return (
		typeof data === 'object' &&
		data !== null &&
		'likes' in data &&
		typeof (data as { likes: unknown }).likes === 'number'
	)
}

async function handle_like_response(
	response: Response,
	error_message: string,
): Promise<LikeResponse> {
	if (!response.ok) {
		throw new Error(`${error_message}: ${String(response.status)}`)
	}

	const data = await response.json()

	if (!validate_like_response(data)) {
		throw new Error(ERROR_INVALID_RESPONSE_FORMAT)
	}

	return data
}

async function get(slug: string): Promise<LikeResponse> {
	const response = await fetch(`/api/like?slug=${slug}`, {
		headers: {
			[HTTP_HEADERS.X_APP_CLIENT]: APP.ID,
		},
	})

	return await handle_like_response(response, 'Failed to get likes')
}

async function increment(slug: string): Promise<LikeResponse> {
	const response = await fetch('/api/like', {
		method: 'POST',
		headers: {
			[HTTP_HEADERS.CONTENT_TYPE]: 'application/json',
			[HTTP_HEADERS.X_APP_CLIENT]: APP.ID,
		},
		body: JSON.stringify({ slug }),
	})

	return await handle_like_response(response, 'Failed to increment likes')
}

export const like_api = {
	get,
	increment,
}
