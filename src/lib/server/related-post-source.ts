import type { Post } from '$lib/types/blog'
import type { SearchDocument } from '$lib/types/search'
import { blog_parser } from '$lib/utils/blog-parser'
import { content_length } from '$lib/utils/content-length'
import { content_quality } from '$lib/utils/content-quality'
import { post_order } from '$lib/utils/post-order'
import { related_posts, type RelatedSource } from '$lib/utils/related-posts'
import { search_index } from '$lib/utils/search-index'

const POST_URL_PREFIX = '/blog/'
const POST_PATH_PREFIX = '/src/lib/posts/'
const POST_PATH_SUFFIX = '.md'

// Eager and raw, so the catalog below is assembled synchronously as this module loads. The lazy
// loader used by the article page would make it a promise instead, and this file is imported once
// per server instance rather than once per request. It is also the same raw markdown the
// content-length gate reads: measuring anything else here would disagree with what gets indexed.
//
// The pattern is spelled out rather than built from the constants below: Vite resolves globs at
// build time and only accepts a literal here, so an interpolated path silently matches nothing.
const raw_posts = import.meta.glob<string>('/src/lib/posts/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
})

interface PostCatalog {
	source: RelatedSource
	candidates_by_id: Map<string, Post>
	posts_by_slug: Map<string, Post>
}

function to_document_id(slug: string): string {
	return `${POST_URL_PREFIX}${slug}`
}

function to_content_length(slug: string): number {
	return content_length.measure(raw_posts[`${POST_PATH_PREFIX}${slug}${POST_PATH_SUFFIX}`] ?? '')
}

// Posts below the content-length gate are noindex low-value pages, so recommending them would
// spend an article's outbound links on exactly the pages this section exists to compensate for.
// They are dropped as candidates only — such a post's own page still gets a related list.
function to_candidates(posts: Array<Post>): Array<Post> {
	return posts.filter((post) => content_quality.is_substantial(to_content_length(post.slug)))
}

function to_documents(posts: Array<Post>): Array<SearchDocument> {
	const by_id = new Map(
		search_index.build_blog_documents().map((document_) => [document_.id, document_]),
	)

	return posts
		.map((post) => by_id.get(to_document_id(post.slug)))
		.filter((document_): document_ is SearchDocument => document_ !== undefined)
}

function build_catalog(): PostCatalog {
	const posts = post_order.sort_by_effective_date(blog_parser.get_all_posts())
	const candidates = to_candidates(posts)

	return {
		source: related_posts.build_source(to_documents(candidates)),
		candidates_by_id: new Map(candidates.map((post) => [to_document_id(post.slug), post])),
		posts_by_slug: new Map(posts.map((post) => [post.slug, post])),
	}
}

// Built once per server instance. The post set is fixed at build time, while measuring every post
// and indexing every body is far too much work to repeat on each article request.
const catalog = build_catalog()

function to_query_text(post: Post | undefined): string {
	return post ? `${post.title} ${post.excerpt}` : ''
}

function load(slug: string): Array<Post> {
	const query = {
		id: to_document_id(slug),
		text: to_query_text(catalog.posts_by_slug.get(slug)),
	}

	return related_posts
		.select(catalog.source, query)
		.map((id) => catalog.candidates_by_id.get(id))
		.filter((post): post is Post => post !== undefined)
}

const related_post_source = {
	load,
}

export { related_post_source }
