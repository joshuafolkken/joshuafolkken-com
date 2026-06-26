import { blog_images } from '$lib/data/blog-images'
import { blog_parser } from '$lib/utils/blog-parser'
import { describe, expect, it } from 'vitest'

describe('WebP image files', () => {
	describe('blog images', () => {
		it('should resolve cover_image for all posts that have one', () => {
			const posts = blog_parser.get_all_posts()

			for (const post of posts) {
				if (!post.cover_image) {
					continue
				}

				const resolved = blog_images.resolve_url(post.cover_image)

				expect(
					resolved,
					`Post "${post.slug}" has cover_image "${post.cover_image}" but no matching image in src/lib/assets/images/blog/`,
				).toBeDefined()
			}
		})
	})
})
