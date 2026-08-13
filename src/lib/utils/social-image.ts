import { APP } from '$lib/app'
import { youtube } from '$lib/utils/youtube'

// Resolves the absolute image a post shares with. A cover image is a site-relative path and needs
// the origin prefixed; the YouTube thumbnail is already absolute. Talk posts carry no cover image,
// so without the fallback they ship no og:image at all and share as a bare text card.
function resolve_url(
	cover_image_url: string | undefined,
	youtube_url: string | undefined,
): string | undefined {
	if (cover_image_url) return `${APP.URL}${cover_image_url}`

	return youtube.get_thumbnail_url(youtube_url)
}

export const social_image = { resolve_url }
