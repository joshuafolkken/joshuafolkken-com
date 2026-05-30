import { APP } from '$lib/app'
import { CONTENT_TYPE, HTTP_HEADERS } from '$lib/constants/http'
import {
	SITEMAP_CACHE_MAX_AGE_SECONDS,
	SITEMAP_CHANGEFREQ,
	SITEMAP_PRIORITY_DEFAULT,
	SITEMAP_PRIORITY_HOME,
	SITEMAP_ROUTE,
} from '$lib/constants/sitemap'
import { PROJECTS } from '$lib/data/projects'
import { git_utilities } from '$lib/server/git-utilities'
import { blog_parser } from '$lib/utils/blog-parser'
import { date_utilities } from '$lib/utils/date-utilities'
import { project_utilities } from '$lib/utils/project-utilities'
import type { RequestHandler } from './$types'

const PROJECT_CASE_STUDIES_PATH = '/src/lib/data/project-case-studies.ts'

interface SitemapUrl {
	loc: string
	changefreq: string
	priority: string
	lastmod: string
}

function is_static_route(route: string): boolean {
	return !route.includes('[') && !route.includes(SITEMAP_ROUTE)
}

function create_sitemap_entry(route: string, filepath_or_lastmod: string | Date): SitemapUrl {
	const is_home = !route
	const lastmod =
		typeof filepath_or_lastmod === 'string'
			? git_utilities.get_file_lastmod(filepath_or_lastmod)
			: filepath_or_lastmod

	return {
		loc: `${APP.URL}${route}`,
		changefreq: SITEMAP_CHANGEFREQ,
		priority: is_home ? SITEMAP_PRIORITY_HOME : SITEMAP_PRIORITY_DEFAULT,
		lastmod: date_utilities.format_date_to_w3c(lastmod),
	}
}

function get_static_pages(): Array<SitemapUrl> {
	const pages = import.meta.glob('/src/routes/**/+page.svelte')

	return Object.keys(pages)
		.map((path) => ({
			path,
			route: path.replace('/src/routes', '').replace('/+page.svelte', ''),
		}))
		.filter(({ route }) => is_static_route(route))
		.map(({ path, route }) => create_sitemap_entry(route, path))
}

function get_blog_posts(): Array<SitemapUrl> {
	return blog_parser
		.get_all_posts()
		.map((post) => create_sitemap_entry(`/blog/${post.slug}`, new Date(post.updated ?? post.date)))
}

function get_project_pages(): Array<SitemapUrl> {
	return PROJECTS.map((project) =>
		create_sitemap_entry(
			project_utilities.get_detail_path(project.slug),
			PROJECT_CASE_STUDIES_PATH,
		),
	)
}

function escape_xml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;')
}

function generate_url_xml(urls: Array<SitemapUrl>): string {
	return urls
		.map(
			(url) => `  <url>
    <loc>${escape_xml(url.loc)}</loc>
    <lastmod>${escape_xml(url.lastmod)}</lastmod>
    <changefreq>${escape_xml(url.changefreq)}</changefreq>
    <priority>${escape_xml(url.priority)}</priority>
  </url>`,
		)
		.join('\n')
}

const GET: RequestHandler = () => {
	const static_pages = get_static_pages()
	const project_pages = get_project_pages()
	const blog_posts = get_blog_posts()
	const all_urls = [...static_pages, ...project_pages, ...blog_posts]

	const url_xml = generate_url_xml(all_urls)

	const sitemap_xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url_xml}
</urlset>`

	return new Response(sitemap_xml, {
		headers: {
			[HTTP_HEADERS.CACHE_CONTROL]: `public, max-age=${String(SITEMAP_CACHE_MAX_AGE_SECONDS)}`,
			[HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE.XML,
		},
	})
}

// SvelteKit configuration
// eslint-disable-next-line @typescript-eslint/naming-convention
const prerender = true

export { GET, prerender }
