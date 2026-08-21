import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const APP_URL = 'https://joshuafolkken.com'
const X_HANDLE = '@joshuafolkken'
const NONEMPTY = /.+/u
const BLOG_PATH = /\/blog\//u
const OG_TITLE = 'meta[property="og:title"]'
const OG_DESCRIPTION = 'meta[property="og:description"]'
const OG_URL = 'meta[property="og:url"]'
const OG_TYPE = 'meta[property="og:type"]'
const CANONICAL = 'link[rel="canonical"]'

test.describe('SEO: blog article page', () => {
	test('og:type is article', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.locator(OG_TYPE)).toHaveAttribute('content', 'article')
	})

	test('og:title is non-empty', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.locator(OG_TITLE)).toHaveAttribute('content', NONEMPTY)
	})

	test('og:description is non-empty', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.locator(OG_DESCRIPTION)).toHaveAttribute('content', NONEMPTY)
	})

	test('og:url contains /blog/', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.locator(OG_URL)).toHaveAttribute('content', BLOG_PATH)
	})

	test('twitter:site is set', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.locator('meta[name="twitter:site"]')).toHaveAttribute('content', X_HANDLE)
	})

	test('canonical href contains /blog/', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.locator(CANONICAL)).toHaveAttribute('href', BLOG_PATH)
	})
})

test.describe('SEO: low-value posts are excluded from indexing', () => {
	const ROBOTS_NOINDEX = 'meta[name="robots"]'
	const THIN_POST = TEST_ROUTES.BLOG_THIN_POST
	const SUBSTANTIAL_POST = TEST_ROUTES.BLOG_POST

	test('a thin, low-value post is marked noindex', async ({ page }) => {
		await page.goto(THIN_POST)

		await expect(page.locator(ROBOTS_NOINDEX)).toHaveAttribute('content', /noindex/u)
	})

	test('a substantial post is not marked noindex', async ({ page }) => {
		await page.goto(SUBSTANTIAL_POST)

		await expect(page.locator(ROBOTS_NOINDEX)).toHaveCount(0)
	})
})

test.describe('SEO: static pages have og:title, og:url, and canonical', () => {
	const static_pages = [
		{ route: TEST_ROUTES.ABOUT, url_pattern: /\/about/u },
		{ route: TEST_ROUTES.PROJECTS, url_pattern: /\/projects/u },
		{ route: TEST_ROUTES.CONTACT, url_pattern: /\/contact/u },
		{ route: TEST_ROUTES.BLOG, url_pattern: /\/blog/u },
		{ route: TEST_ROUTES.HOME, url_pattern: new RegExp(APP_URL, 'u') },
	]

	for (const { route, url_pattern } of static_pages) {
		test(`${route} has og:title`, async ({ page }) => {
			await page.goto(route)

			await expect(page.locator(OG_TITLE)).toHaveAttribute('content', NONEMPTY)
		})

		test(`${route} og:url matches expected pattern`, async ({ page }) => {
			await page.goto(route)

			await expect(page.locator(OG_URL)).toHaveAttribute('content', url_pattern)
		})

		test(`${route} has canonical link`, async ({ page }) => {
			await page.goto(route)

			await expect(page.locator(CANONICAL)).toHaveAttribute('href', NONEMPTY)
		})
	}
})
