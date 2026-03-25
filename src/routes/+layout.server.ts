import { opencollective_api } from '$lib/api/opencollective-api'
import { logger } from '$lib/logger'
import { cache_keys } from '$lib/server/cache-keys'
import { kv_cache } from '$lib/server/kv-cache'
import type { LayoutServerLoad } from './$types'

/**
 * Fetches and caches OpenCollective supporters for the layout.
 * Returns an empty list if no route.id is present or if fetching fails.
 */
export const load: LayoutServerLoad = async ({ fetch, platform, route }) => {
	if (!route.id) return { supporters: [] }

	try {
		const supporters = await kv_cache.get(
			cache_keys.SUPPORTERS,
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
