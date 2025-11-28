import type { Post } from '$lib/types/blog'
import { blog_parser } from '$lib/utils/blog-parser'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
	const paths = import.meta.glob('/src/lib/posts/*.md', { eager: true })

	const posts = Object.entries(paths)
		.map(([path, file]) => blog_parser.parse_post(path, file))
		.filter((post): post is Post => post !== undefined)
		.toSorted((post_a, post_b) => new Date(post_b.date).getTime() - new Date(post_a.date).getTime())

	return { posts }
}
