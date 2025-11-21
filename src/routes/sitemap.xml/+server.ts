import { execSync } from 'node:child_process'
import { APP } from '$lib/app'
import type { RequestHandler } from './$types'

interface SitemapUrl {
	loc: string
	changefreq: string
	priority: string
	lastmod: string
}

interface MdsvexFile {
	metadata: {
		date?: string
		[key: string]: unknown
	}
}

function format_date_to_w3c(date: Date): string {
	return date.toISOString()
}

// Gitからファイルの最終更新日時を取得する
function get_file_lastmod(path: string): Date {
	try {
		// ファイルパスはプロジェクトルート相対（例: src/routes/+page.svelte）になっている前提
		// 先頭の / を削除して git コマンドに渡す
		const relative_path = path.startsWith('/') ? path.slice(1) : path

		// git log でそのファイルの最終コミット日時を取得 (ISO 8601形式)
		// eslint-disable-next-line sonarjs/os-command
		const stdout = execSync(`git log -1 --format=%cI -- "${relative_path}"`, {
			encoding: 'utf8',
		})

		if (stdout.trim() !== '') {
			return new Date(stdout.trim())
		}
	} catch {
		// Gitコマンドが失敗した場合や、まだコミットされていないファイルの場合は無視
	}

	// 取得できなかった場合は現在日時（ビルド日時）を返す
	return new Date()
}

function create_sitemap_entry(route: string, filepath: string): SitemapUrl {
	const is_home = route === ''
	const lastmod = get_file_lastmod(filepath)
	return {
		loc: `${APP.URL}${route}`,
		changefreq: 'weekly',
		priority: is_home ? '1.0' : '0.8',
		lastmod: format_date_to_w3c(lastmod),
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
	const posts = import.meta.glob('/src/lib/posts/*.md', { eager: true })

	return Object.entries(posts)
		.map(([path, file]) => {
			const mdsvex_file = file as MdsvexFile
			const slug = path.split('/').pop()?.replace('.md', '')
			return { slug, metadata: mdsvex_file.metadata }
		})
		.filter(
			(post): post is { slug: string; metadata: { date: string } } =>
				post.slug !== undefined && post.metadata.date !== undefined,
		)
		.map((post) => ({
			loc: `${APP.URL}/blog/${post.slug}`,
			changefreq: 'weekly',
			priority: '0.8',
			lastmod: format_date_to_w3c(new Date(post.metadata.date)),
		}))
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
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	})
}

// SvelteKit configuration
// eslint-disable-next-line @typescript-eslint/naming-convention
const prerender = true

export { GET, prerender }
