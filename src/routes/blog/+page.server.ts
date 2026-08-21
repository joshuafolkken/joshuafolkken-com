import { blog_parser } from '$lib/utils/blog-parser'
import { post_order } from '$lib/utils/post-order'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
	const posts = post_order.sort_by_effective_date(blog_parser.get_all_posts())

	return { posts }
}
