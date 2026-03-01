/* eslint-disable @typescript-eslint/naming-convention */
export interface OpenCollectiveMember {
	MemberId: number
	name: string
	image: string | null
	profile: string
	totalAmountDonated: number
	role: string
}

export interface GraphqlContributor {
	id: string
	totalAmountContributed: { value: number }
	account: { name: string; slug: string; imageUrl: string | null } | null
	isBacker: boolean
}

export interface GraphqlResponse {
	data?: { account?: { contributors?: { nodes: Array<GraphqlContributor> } } }
	errors?: Array<{ message: string }>
}
