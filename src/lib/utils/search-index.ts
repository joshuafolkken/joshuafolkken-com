import { PROJECTS } from '$lib/data/projects'
import type { Post } from '$lib/types/blog'
import { PAGES, type Page } from '$lib/types/page'
import type { Project } from '$lib/types/project'
import type { SearchDocument } from '$lib/types/search'
import { blog_parser } from '$lib/utils/blog-parser'

type SearchableProject = Pick<Project, 'slug' | 'title' | 'subtitle' | 'description' | 'tags'>

const FRONTMATTER_FENCE = '---\n'
const CODE_FENCE = '```'
const CODE_FENCE_STEP = 2

/* eslint-disable sonarjs/super-linear-regex -- trusted, author-written markdown at build/prerender time (never request input), not a DoS vector */
const IMAGE = /!\[[^\]]*\]\([^)]*\)/gu
const LINK = /\[([^\]]*)\]\([^)]*\)/gu
const INLINE_CODE = /`[^`]*`/gu
const HTML_TAG = /<[^>]+>/gu
/* eslint-enable sonarjs/super-linear-regex */

const MD_MARKS = /[#>*_~`-]/gu
const MULTISPACE = /\s+/gu

function strip_frontmatter(raw: string): string {
	if (!raw.startsWith(FRONTMATTER_FENCE)) return raw

	const end = raw.indexOf(`\n${FRONTMATTER_FENCE}`, FRONTMATTER_FENCE.length)

	return end === -1 ? raw : raw.slice(end + FRONTMATTER_FENCE.length + 1)
}

function strip_code_blocks(text: string): string {
	return text
		.split(CODE_FENCE)
		.filter((_, index) => index % CODE_FENCE_STEP === 0)
		.join(' ')
}

function markdown_to_text(raw: string): string {
	return strip_code_blocks(strip_frontmatter(raw))
		.replaceAll(IMAGE, ' ')
		.replaceAll(LINK, '$1')
		.replaceAll(INLINE_CODE, ' ')
		.replaceAll(HTML_TAG, ' ')
		.replaceAll(MD_MARKS, ' ')
		.replaceAll(MULTISPACE, ' ')
		.trim()
}

function post_to_document(post: Post, raw: string): SearchDocument {
	const url = `/blog/${post.slug}`

	return {
		id: url,
		type: 'blog',
		title: post.title,
		excerpt: post.excerpt,
		body: markdown_to_text(raw),
		url,
	}
}

function project_to_document(project: SearchableProject): SearchDocument {
	const url = `/projects/${project.slug}`
	const tag_text = project.tags?.join(' ') ?? ''

	return {
		id: url,
		type: 'project',
		title: project.title,
		excerpt: project.subtitle ?? '',
		body: `${project.description} ${tag_text}`.trim(),
		url,
	}
}

function is_internal_link(link: string | undefined): link is string {
	return typeof link === 'string' && link.startsWith('/')
}

function page_to_document(page: Page): SearchDocument | undefined {
	if (!is_internal_link(page.link)) return undefined

	return {
		id: page.link,
		type: 'page',
		title: page.title,
		excerpt: page.description,
		body: `${page.title} ${page.description}`,
		url: page.link,
	}
}

function build_blog_documents(): Array<SearchDocument> {
	const raw_posts = import.meta.glob<string>('/src/lib/posts/*.md', {
		query: '?raw',
		import: 'default',
		eager: true,
	})

	return blog_parser
		.get_all_posts()
		.map((post) => post_to_document(post, raw_posts[`/src/lib/posts/${post.slug}.md`] ?? ''))
}

function build_page_documents(): Array<SearchDocument> {
	return Object.values(PAGES)
		.map((page) => page_to_document(page))
		.filter((document_): document_ is SearchDocument => document_ !== undefined)
}

function build_search_documents(): Array<SearchDocument> {
	return [
		...build_blog_documents(),
		...PROJECTS.map((project) => project_to_document(project)),
		...build_page_documents(),
	]
}

const search_index = {
	build_search_documents,
	markdown_to_text,
	page_to_document,
	post_to_document,
	project_to_document,
}

export { search_index }
