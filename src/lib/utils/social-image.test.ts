import { APP } from '$lib/app'
import { describe, expect, it } from 'vitest'
import { social_image } from './social-image'

const COVER_IMAGE_URL = '/_app/immutable/assets/kit-2.webp'
const VIDEO_ID = 'UI3-GR6yvjY'
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`
const THUMBNAIL_URL = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`

describe('social_image.resolve_url', () => {
	it('prefixes the site origin onto a cover image path', () => {
		expect(social_image.resolve_url(COVER_IMAGE_URL, undefined)).toBe(
			`${APP.URL}${COVER_IMAGE_URL}`,
		)
	})

	it('prefers the cover image when the post also has a video', () => {
		expect(social_image.resolve_url(COVER_IMAGE_URL, WATCH_URL)).toBe(
			`${APP.URL}${COVER_IMAGE_URL}`,
		)
	})

	// Talk posts have no cover image, so this fallback is the only thing giving them a share image.
	it('falls back to the YouTube thumbnail when there is no cover image', () => {
		expect(social_image.resolve_url(undefined, WATCH_URL)).toBe(THUMBNAIL_URL)
	})

	it('returns undefined when the post has neither', () => {
		expect(social_image.resolve_url(undefined, undefined)).toBeUndefined()
	})
})
