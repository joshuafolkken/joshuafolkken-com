import { OPENCOLLECTIVE } from '$lib/app'
import { kv_cache, type KVNamespace } from '$lib/server/kv-cache'
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

function get_kv_from_platform(platform: App.Platform | undefined): KVNamespace | undefined {
	if (platform?.env === undefined || platform.env === null) {
		return undefined
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const cache = (platform.env as { CACHE?: KVNamespace }).CACHE
	return cache ?? undefined
}

export const load: LayoutServerLoad = async ({ fetch, platform }) => {
	try {
		const kv = get_kv_from_platform(platform)

		if (kv === undefined) {
			throw new Error('KV cache not available')
		}

		const supporters = await kv_cache.get(CACHE_KEY, async () => await fetch_supporters(fetch), kv)

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
