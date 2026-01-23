import { OPENCOLLECTIVE } from '$lib/app'
import { logger } from '$lib/logger'
import { kv_cache } from '$lib/server/kv-cache'
import type { OpenCollectiveMember } from '$lib/types/opencollective'
import type { LayoutServerLoad } from './$types'

const CACHE_KEY = 'supporters'

function filter_and_sort_supporters(
	members: Array<OpenCollectiveMember>,
): Array<OpenCollectiveMember> {
	const filtered = members.filter(
		(participant) => participant.role === 'BACKER' || participant.role === 'SPONSOR',
	)
	return filtered.toSorted((first, second) => second.totalAmountDonated - first.totalAmountDonated)
}

async function fetch_supporters(
	fetch: typeof globalThis.fetch,
): Promise<Array<OpenCollectiveMember>> {
	const url = `https://opencollective.com/${OPENCOLLECTIVE.SLUG}/members/all.json?limit=5`

	const response = await fetch(url)

	if (!response.ok) throw new Error('Failed to fetch backers')

	const members: Array<OpenCollectiveMember> = await response.json()
	return filter_and_sort_supporters(members)
}

export const load: LayoutServerLoad = async ({ fetch, platform }) => {
	try {
		const supporters = await kv_cache.get(
			CACHE_KEY,
			async () => await fetch_supporters(fetch),
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
