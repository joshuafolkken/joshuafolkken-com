/* eslint-disable @typescript-eslint/naming-convention */
export interface OpenCollectiveMember {
	MemberId: number
	name: string
	image: string | null
	profile: string
	totalAmountDonated: number
	role: string
}
