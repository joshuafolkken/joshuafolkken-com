import { OPENCOLLECTIVE } from '$lib/app'
import { in_memory_cache } from '$lib/server/in-memory-cache'
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

	const members = (await response.json()) as Array<OpenCollectiveMember>
	return filter_and_sort_supporters(members)
}

export const load: LayoutServerLoad = async ({ fetch }) => {
	try {
		const supporters = await in_memory_cache.with_cache(
			CACHE_KEY,
			async () => await fetch_supporters(fetch),
		)
		return {
			supporters,
		}
	} catch (error) {
		console.error('[layout.server] Error fetching supporters:', error)
		return {
			supporters: [],
		}
	}
}
