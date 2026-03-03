import { blog_parser } from '$lib/utils/blog-parser'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
	const posts = blog_parser
		.get_all_posts()
		.toSorted((post_a, post_b) => new Date(post_b.date).getTime() - new Date(post_a.date).getTime())

	return { posts }
}
