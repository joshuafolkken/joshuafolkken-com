import { APP } from '$lib/app'
import { HTTP_HEADERS } from '$lib/constants/http'

async function get(slug: string): Promise<{ likes: number }> {
	const response = await fetch(`/api/like?slug=${slug}`, {
		headers: {
			[HTTP_HEADERS.X_APP_CLIENT]: APP.ID,
		},
	})

	if (!response.ok) {
		throw new Error(`Failed to get likes: ${String(response.status)}`)
	}

	return (await response.json()) as { likes: number }
}

async function increment(slug: string): Promise<{ likes: number }> {
	const response = await fetch('/api/like', {
		method: 'POST',
		headers: {
			[HTTP_HEADERS.CONTENT_TYPE]: 'application/json',
			[HTTP_HEADERS.X_APP_CLIENT]: APP.ID,
		},
		body: JSON.stringify({ slug }),
	})

	if (!response.ok) {
		throw new Error(`Failed to increment likes: ${String(response.status)}`)
	}

	return (await response.json()) as { likes: number }
}

export const like_api = {
	get,
	increment,
}
