/* eslint-disable unicorn/no-null -- OpenCollective types use null in their API contract */
import type { OpenCollectiveMember } from '$lib/types/opencollective'
import { describe, expect, it } from 'vitest'
import { opencollective_utilities } from './opencollective-utilities'

const OPENCOLLECTIVE_IMAGES_BASE = 'https://images.opencollective.com'
const OPENCOLLECTIVE_BASE = 'https://opencollective.com'
const DEFAULT_PROFILE = `${OPENCOLLECTIVE_BASE}/some-user`

function make_member(image: string | null, profile = DEFAULT_PROFILE): OpenCollectiveMember {
	return {
		MemberId: 1,
		name: 'Test User',
		image,
		profile,
		totalAmountDonated: 100,
		role: 'BACKER',
	}
}

describe('opencollective_utilities.get_avatar_url', () => {
	it('returns image URL from images.opencollective.com', () => {
		const image = `${OPENCOLLECTIVE_IMAGES_BASE}/user-slug/avatar.png`
		const result = opencollective_utilities.get_avatar_url(make_member(image))

		expect(result).toBe(image)
	})

	it('returns image URL from opencollective.com', () => {
		const image = `${OPENCOLLECTIVE_BASE}/user-slug/avatar.png`
		const result = opencollective_utilities.get_avatar_url(make_member(image))

		expect(result).toBe(image)
	})

	it('returns fallback URL when image is null', () => {
		const profile = `${OPENCOLLECTIVE_BASE}/john-doe`
		const result = opencollective_utilities.get_avatar_url(make_member(null, profile))

		expect(result).toBe(`${OPENCOLLECTIVE_IMAGES_BASE}/john-doe/avatar.png`)
	})

	it('returns fallback URL when image is from an external domain', () => {
		const profile = `${OPENCOLLECTIVE_BASE}/external-user`
		const result = opencollective_utilities.get_avatar_url(
			make_member('https://example.com/avatar.png', profile),
		)

		expect(result).toBe(`${OPENCOLLECTIVE_IMAGES_BASE}/external-user/avatar.png`)
	})

	it('returns fallback with guest slug when profile is empty', () => {
		const result = opencollective_utilities.get_avatar_url(make_member(null, ''))

		expect(result).toBe(`${OPENCOLLECTIVE_IMAGES_BASE}/guest/avatar.png`)
	})
})
