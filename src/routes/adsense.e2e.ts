import { expect, test, type Page } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const ADSENSE_SRC = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
const ADSENSE_POLL_TIMEOUT = 15_000
const BLOG_NAV_TIMEOUT = 25_000
const BLOG_TEST_TIMEOUT = 45_000

async function has_adsense_script(page: Page): Promise<boolean> {
	const scripts = await page.locator('head script').all()

	const sources = await Promise.all(scripts.map(async (script) => await script.getAttribute('src')))

	return sources.some((source) => source?.includes(ADSENSE_SRC) ?? false)
}

test.describe('AdSense script placement', () => {
	// eslint-disable-next-line sonarjs/assertions-in-tests -- Playwright expect.poll(...).toBe is a web-first assertion sonarjs does not recognize
	test('present on /about', async ({ page }) => {
		await page.goto(TEST_ROUTES.ABOUT, { waitUntil: 'domcontentloaded' })
		await expect
			.poll(async () => await has_adsense_script(page), { timeout: ADSENSE_POLL_TIMEOUT })
			.toBe(true)
	})

	test('absent on /', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(false)
	})

	test('absent on /projects', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(false)
	})

	test('absent on /contact', async ({ page }) => {
		await page.goto(TEST_ROUTES.CONTACT, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(false)
	})
})

test.describe('AdSense script placement on blog pages', () => {
	test.describe.configure({ timeout: BLOG_TEST_TIMEOUT })

	// eslint-disable-next-line sonarjs/assertions-in-tests -- Playwright expect.poll(...).toBe is a web-first assertion sonarjs does not recognize
	test('present on /blog list', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG, { waitUntil: 'domcontentloaded', timeout: BLOG_NAV_TIMEOUT })
		await expect
			.poll(async () => await has_adsense_script(page), { timeout: ADSENSE_POLL_TIMEOUT })
			.toBe(true)
	})

	// eslint-disable-next-line sonarjs/assertions-in-tests -- Playwright expect.poll(...).toBe is a web-first assertion sonarjs does not recognize
	test('present on /blog/[slug]', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST, {
			waitUntil: 'domcontentloaded',
			timeout: BLOG_NAV_TIMEOUT,
		})
		await expect
			.poll(async () => await has_adsense_script(page), { timeout: ADSENSE_POLL_TIMEOUT })
			.toBe(true)
	})
})
