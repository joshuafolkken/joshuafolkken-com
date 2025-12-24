import { OPENCOLLECTIVE } from '$lib/app'
import type { OpenCollectiveMember } from '$lib/types/opencollective'
import type { LayoutServerLoad } from './$types'

interface SupportersCache {
	data: Array<OpenCollectiveMember>
	timestamp: number
}

// eslint-disable-next-line init-declarations
let supporters_cache: SupportersCache | undefined
const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const CACHE_DURATION = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR // 1時間

function is_cache_valid(cache: SupportersCache | undefined, now: number): cache is SupportersCache {
	return cache !== undefined && now - cache.timestamp < CACHE_DURATION
}

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
	console.info(`[layout.server] Fetching: ${url}`)

	const response = await fetch(url)
	const status_code = response.status
	console.info(`[layout.server] Response status: ${String(status_code)}`)

	if (!response.ok) throw new Error('Failed to fetch backers')

	const members = (await response.json()) as Array<OpenCollectiveMember>
	return filter_and_sort_supporters(members)
}

function update_cache(supporters: Array<OpenCollectiveMember>, timestamp: number): void {
	supporters_cache = {
		data: supporters,
		timestamp,
	}
}

function get_cached_supporters(cache: SupportersCache): Array<OpenCollectiveMember> {
	console.info('[layout.server] Returning cached supporters data')
	return cache.data
}

function handle_fetch_error(error: unknown): { supporters: Array<OpenCollectiveMember> } {
	console.error(error)

	// エラー時はキャッシュがあればそれを返す (Stale-if-error)
	if (supporters_cache !== undefined) {
		console.warn('[layout.server] Returning stale cache due to fetch error')
		return {
			supporters: supporters_cache.data,
		}
	}

	return {
		supporters: [],
	}
}

export const load: LayoutServerLoad = async ({ fetch }) => {
	const now = Date.now()

	// キャッシュがあり、有効期限内ならキャッシュを返す
	if (is_cache_valid(supporters_cache, now)) {
		return {
			supporters: get_cached_supporters(supporters_cache),
		}
	}

	try {
		const supporters = await fetch_supporters(fetch)
		update_cache(supporters, now)

		return {
			supporters,
		}
	} catch (error) {
		return handle_fetch_error(error)
	}
}
