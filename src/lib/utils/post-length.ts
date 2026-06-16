import { content_length } from '$lib/utils/content-length'

// Lazy raw glob so each consumer only pulls the markdown it actually measures
// (the universal blog page loads a single post; the sitemap measures all of
// them at prerender time).
const raw_posts = import.meta.glob('/src/lib/posts/*.md', { query: '?raw', import: 'default' })

async function measure(slug: string): Promise<number> {
	const loader = raw_posts[`/src/lib/posts/${slug}.md`]
	if (!loader) return 0

	const raw = await loader()

	return typeof raw === 'string' ? content_length.measure(raw) : 0
}

export const post_length = { measure }
