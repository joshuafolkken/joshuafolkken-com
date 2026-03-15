import type { OpenCollectiveMember } from '$lib/types/opencollective'
import { path_utilities } from '$lib/utils/path-utilities'

const OPENCOLLECTIVE_DOMAIN = 'opencollective.com'
const OPENCOLLECTIVE_IMAGES_BASE = `https://images.${OPENCOLLECTIVE_DOMAIN}`
const ALLOWED_IMAGE_ORIGINS = new Set([
	OPENCOLLECTIVE_IMAGES_BASE,
	`https://${OPENCOLLECTIVE_DOMAIN}`,
])
const DEFAULT_AVATAR_SLUG = 'guest'

function is_allowed_image_url(url: string): boolean {
	try {
		const { origin } = new URL(url)

		return ALLOWED_IMAGE_ORIGINS.has(origin)
	} catch {
		return false
	}
}

function get_avatar_url(member: OpenCollectiveMember): string {
	if (member.image && is_allowed_image_url(member.image)) {
		return member.image
	}

	const slug = path_utilities.get_last_segment(member.profile) || DEFAULT_AVATAR_SLUG

	return `${OPENCOLLECTIVE_IMAGES_BASE}/${slug}/avatar.png`
}

const opencollective_utilities = {
	get_avatar_url,
}

export { opencollective_utilities }
