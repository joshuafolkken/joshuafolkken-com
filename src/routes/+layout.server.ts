import { OPENCOLLECTIVE } from '$lib/app'
import type { OpenCollectiveMember } from '$lib/types/opencollective'
import type { LayoutServerLoad } from './$types'

interface SupportersCache {
	data: Array<OpenCollectiveMember>
	timestamp: number
}

let supporters_cache: SupportersCache | null = null
const CACHE_DURATION = 1000 * 60 * 60 // 1時間

export const load: LayoutServerLoad = async ({ fetch }) => {
	const now = Date.now()

	// キャッシュがあり、有効期限内ならキャッシュを返す
	if (supporters_cache !== null && now - supporters_cache.timestamp < CACHE_DURATION) {
		console.info('[layout.server] Returning cached supporters data')
		return {
			supporters: supporters_cache.data,
		}
	}

	try {
		const url = `https://opencollective.com/${OPENCOLLECTIVE.SLUG}/members/all.json?limit=5`
		console.info(`[layout.server] Fetching: ${url}`)

		const response = await fetch(url)

		console.info(`[layout.server] Response status: ${response.status}`)

		if (!response.ok) throw new Error('Failed to fetch backers')

		const members: Array<OpenCollectiveMember> = await response.json()

		// console.log(members)

		const supporters = members
			.filter((participant) => participant.role === 'BACKER' || participant.role === 'SPONSOR')
			.sort((a, b) => b.totalAmountDonated - a.totalAmountDonated)

		// console.log(supporters)

		// キャッシュ更新
		supporters_cache = {
			data: supporters,
			timestamp: now,
		}

		return {
			supporters,
		}
	} catch (error) {
		console.error(error)

		// エラー時はキャッシュがあればそれを返す (Stale-if-error)
		if (supporters_cache !== null) {
			console.warn('[layout.server] Returning stale cache due to fetch error')
			return {
				supporters: supporters_cache.data,
			}
		}

		return {
			supporters: [],
		}
	}
}
