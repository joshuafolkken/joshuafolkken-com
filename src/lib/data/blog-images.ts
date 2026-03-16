/**
 * Blog cover images imported via vite-imagetools for automatic WebP conversion.
 * Maps cover_image paths from markdown frontmatter to processed image URLs.
 */

import { path_utilities } from '$lib/utils/path-utilities'

const blog_image_modules = import.meta.glob<string>(
	'/src/lib/assets/images/blog/*.{jpg,jpeg,png}',
	{ query: '?url', import: 'default', eager: true },
)

function resolve_url(cover_image_path: string): string | undefined {
	const basename = path_utilities.get_basename_without_extension(cover_image_path)

	for (const [key, url] of Object.entries(blog_image_modules)) {
		if (path_utilities.get_basename_without_extension(key) === basename) {
			return url
		}
	}

	return undefined
}

function get_cover_image_url(cover_image: string | undefined): string | undefined {
	if (cover_image === undefined) return undefined

	return resolve_url(cover_image) ?? cover_image
}

export const blog_images = {
	resolve_url,
	get_cover_image_url,
}
