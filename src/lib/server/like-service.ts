import { like_store } from '$lib/server/like-store'

async function get_likes(slug: string, platform: App.Platform | undefined): Promise<number> {
	return await like_store.get_likes(slug, platform)
}

async function increment_likes(slug: string, platform: App.Platform | undefined): Promise<number> {
	return await like_store.increment_likes(slug, platform)
}

export const like_service = {
	get_likes,
	increment_likes,
}
