import { APP } from '$lib/app'
import type { RequestHandler } from './$types'

interface SitemapUrl {
	loc: string
	changefreq: string
	priority: string
	lastmod: string
}

interface RouteConfig {
	path: string
	lastmod?: Date
}

const ROUTES: Array<RouteConfig> = [
	{ path: '' },
	{ path: '/privacy-policy' },
	{ path: '/profile' },
	{ path: '/projects' },
	{ path: '/blog' },
	{ path: '/blog/first-post' },
]

const DEFAULT_LASTMOD = new Date('2025-11-18')

function format_date_to_w3c(date: Date): string {
	return date.toISOString()
}

function create_url_entry(route_config: RouteConfig): SitemapUrl {
	const is_home = route_config.path === ''
	const lastmod = route_config.lastmod ?? DEFAULT_LASTMOD
	return {
		loc: `${APP.URL}${route_config.path}`,
		changefreq: 'weekly',
		priority: is_home ? '1.0' : '0.8',
		lastmod: format_date_to_w3c(lastmod),
	}
}

function format_url_entry(url: SitemapUrl): string {
	return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
}

function generate_sitemap_xml(): string {
	const url_entries = ROUTES.map((route_config) => create_url_entry(route_config))
	const url_xml = url_entries.map((url) => format_url_entry(url)).join('\n')

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url_xml}
</urlset>`
}

export const GET: RequestHandler = (): Response => {
	const sitemap_xml = generate_sitemap_xml()

	return new Response(sitemap_xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	})
}
