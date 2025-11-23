import { json } from '@sveltejs/kit'
import { like_store } from '$lib/server/like-store'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
	const { slug } = (await request.json()) as { slug?: string }

	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (!slug) {
		const HTTP_BAD_REQUEST = 400
		return json({ error: 'Missing slug' }, { status: HTTP_BAD_REQUEST })
	}

	try {
		const new_count = await like_store.increment_likes(slug)
		return json({ count: new_count })
	} catch {
		const HTTP_INTERNAL_SERVER_ERROR = 500
		return json({ error: 'Failed to update likes' }, { status: HTTP_INTERNAL_SERVER_ERROR })
	}
}
