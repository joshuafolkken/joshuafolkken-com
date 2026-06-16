import { expect, test } from '@playwright/test'
import { PROJECT_SLUGS } from '$lib/data/project-slugs'

const SITE_ORIGIN = 'https://joshuafolkken.com'
const SITEMAP_PATH = '/sitemap.xml'

test.describe('sitemap.xml', () => {
	test('includes every project detail page', async ({ request }) => {
		const response = await request.get(SITEMAP_PATH)
		const body = await response.text()

		for (const slug of PROJECT_SLUGS) {
			expect(body).toContain(`<loc>${SITE_ORIGIN}/projects/${slug}</loc>`)
		}
	})

	test('still includes existing blog posts and the projects index', async ({ request }) => {
		const response = await request.get(SITEMAP_PATH)
		const body = await response.text()

		expect(body).toContain(`<loc>${SITE_ORIGIN}/blog/mnemecha</loc>`)
		expect(body).toContain(`<loc>${SITE_ORIGIN}/projects</loc>`)
	})

	test('excludes low-value posts that are below the content-quality threshold', async ({
		request,
	}) => {
		const response = await request.get(SITEMAP_PATH)
		const body = await response.text()

		expect(response.ok()).toBeTruthy()
		expect(body).not.toContain(`<loc>${SITE_ORIGIN}/blog/first-post</loc>`)
	})
})
