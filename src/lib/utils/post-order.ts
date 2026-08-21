import type { Post } from '$lib/types/blog'

// A post's position in the list is driven by its newest content, so a revised post uses `updated`
// while a post that was never revised falls back to its publication date.
function get_effective_date(post: Post): string {
	return post.updated ?? post.date
}

function to_time(value: string): number {
	return new Date(value).getTime()
}

// Ties on the effective date fall back to the publication date so the order stays stable when
// several posts were revised at the same moment.
function compare_desc(post_a: Post, post_b: Post): number {
	const effective_gap = to_time(get_effective_date(post_b)) - to_time(get_effective_date(post_a))

	if (effective_gap !== 0) return effective_gap

	return to_time(post_b.date) - to_time(post_a.date)
}

function sort_by_effective_date(posts: Array<Post>): Array<Post> {
	return posts.toSorted(compare_desc)
}

export const post_order = {
	get_effective_date,
	sort_by_effective_date,
}
