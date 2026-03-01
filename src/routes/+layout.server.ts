import { opencollective_api } from '$lib/api/opencollective-api'
import { logger } from '$lib/logger'
import { kv_cache } from '$lib/server/kv-cache'
import type { LayoutServerLoad } from './$types'

const CACHE_KEY = 'supporters'

export const load: LayoutServerLoad = async ({ fetch, platform }) => {
	try {
		const supporters = await kv_cache.get(
			CACHE_KEY,
			async () => await opencollective_api.fetch_supporters(fetch),
			platform,
		)

		return {
			supporters,
		}
	} catch (error) {
		logger.error('[layout.server] Error fetching supporters:', error)
		return {
			supporters: [],
		}
	}
}
