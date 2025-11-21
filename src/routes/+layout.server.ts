import { OPENCOLLECTIVE } from '$lib/app'
import type { OpenCollectiveMember } from '$lib/types/opencollective'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch(
			`https://opencollective.com/${OPENCOLLECTIVE.SLUG}/members/all.json?limit=100`,
		)

		if (!response.ok) throw new Error('Failed to fetch backers')

		const members: OpenCollectiveMember[] = await response.json()

		// console.log(members)

		const supporters = members
			.filter((participant) => participant.role === 'BACKER' || participant.role === 'SPONSOR')
			.sort((a, b) => b.totalAmountDonated - a.totalAmountDonated)

		// console.log(supporters)

		return {
			supporters,
		}
	} catch (e) {
		console.error(e)
		return {
			supporters: [],
		}
	}
}
