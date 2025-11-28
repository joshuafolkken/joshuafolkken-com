import { like_store } from '$lib/server/like-store'

async function get_likes(slug: string): Promise<number> {
	return await like_store.get_likes(slug)
}

async function increment_likes(slug: string): Promise<number> {
	await like_store.increment_likes(slug)
	return await like_store.get_likes(slug)
}

export const like_service = {
	get_likes,
	increment_likes,
}
