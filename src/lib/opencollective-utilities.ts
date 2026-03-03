import type { OpenCollectiveMember } from '$lib/types/opencollective'

const OPENCOLLECTIVE_IMAGES_BASE = 'https://images.opencollective.com'
const DEFAULT_AVATAR_SLUG = 'guest'

function get_avatar_url(member: OpenCollectiveMember): string {
	if (member.image !== null) return member.image
	const slug = member.profile.split('/').pop() ?? DEFAULT_AVATAR_SLUG
	return `${OPENCOLLECTIVE_IMAGES_BASE}/${slug}/avatar.png`
}

const opencollective_utilities = {
	get_avatar_url,
}

export { opencollective_utilities }
