import { expect, test } from '@playwright/test'
import { PROJECT_SLUGS } from '$lib/data/project-slugs'

const SITE_ORIGIN = 'https://joshuafolkken.com'
const SITEMAP_PATH = '/sitemap.xml'
// The sitemap endpoint compiles every blog post on its first hit; on a cold dev server that
// legitimately exceeds the 10s action timeout (#807). The content assertions are unchanged —
// only the latency allowance reflects what a cold first compile actually costs.
const COLD_COMPILE_TIMEOUT_MS = 30_000

test.describe('sitemap.xml', () => {
	test('includes every project detail page', async ({ request }) => {
		const response = await request.get(SITEMAP_PATH, { timeout: COLD_COMPILE_TIMEOUT_MS })
		const body = await response.text()

		for (const slug of PROJECT_SLUGS) {
			expect(body).toContain(`<loc>${SITE_ORIGIN}/projects/${slug}</loc>`)
		}
	})

	test('still includes existing blog posts and the projects index', async ({ request }) => {
		const response = await request.get(SITEMAP_PATH, { timeout: COLD_COMPILE_TIMEOUT_MS })
		const body = await response.text()

		expect(body).toContain(`<loc>${SITE_ORIGIN}/blog/mnemecha</loc>`)
		expect(body).toContain(`<loc>${SITE_ORIGIN}/projects</loc>`)
	})

	test('excludes low-value posts that are below the content-quality threshold', async ({
		request,
	}) => {
		const response = await request.get(SITEMAP_PATH, { timeout: COLD_COMPILE_TIMEOUT_MS })
		const body = await response.text()

		expect(response.ok()).toBeTruthy()
		expect(body).not.toContain(`<loc>${SITE_ORIGIN}/blog/first-post</loc>`)
	})
})
