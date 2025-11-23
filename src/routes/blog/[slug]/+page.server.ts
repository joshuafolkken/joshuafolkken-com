import { like_store } from '$lib/server/like-store'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const likes = await like_store.get_likes(params.slug)

	return {
		likes,
	}
}
