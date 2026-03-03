import { APP } from '$lib/app'
import { HTTP_HEADERS } from '$lib/constants/http'
import { git_utilities } from '$lib/server/git-utilities'
import { blog_parser } from '$lib/utils/blog-parser'
import { date_utilities } from '$lib/utils/date-utilities'
import type { RequestHandler } from './$types'

const SITEMAP_CHANGEFREQ = 'weekly'
const SITEMAP_PRIORITY_HOME = '1.0'
const SITEMAP_PRIORITY_DEFAULT = '0.8'

interface SitemapUrl {
	loc: string
	changefreq: string
	priority: string
	lastmod: string
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
		.filter(({ route }) => !route.includes('[') && !route.includes('sitemap.xml'))
		.map(({ path, route }) => create_sitemap_entry(route, path))
}

function get_blog_posts(): Array<SitemapUrl> {
	return blog_parser
		.get_all_posts()
		.map((post) => create_sitemap_entry(`/blog/${post.slug}`, new Date(post.updated ?? post.date)))
}

function generate_url_xml(urls: Array<SitemapUrl>): string {
	return urls
		.map(
			(url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
		)
		.join('\n')
}

const GET: RequestHandler = () => {
	const static_pages = get_static_pages()
	const blog_posts = get_blog_posts()
	const all_urls = [...static_pages, ...blog_posts]

	const url_xml = generate_url_xml(all_urls)

	const sitemap_xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url_xml}
</urlset>`

	return new Response(sitemap_xml, {
		headers: {
			[HTTP_HEADERS.CONTENT_TYPE]: 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	})
}

// SvelteKit configuration
// eslint-disable-next-line @typescript-eslint/naming-convention
const prerender = true

export { GET, prerender }
