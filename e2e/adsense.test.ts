import { expect, test, type Page } from '@playwright/test'
import { TEST_ROUTES } from './test-routes'

const ADSENSE_SRC = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

async function has_adsense_script(page: Page): Promise<boolean> {
	const scripts = await page.locator('head script').all()

	for (const script of scripts) {
		const source = await script.getAttribute('src')

		if (source?.includes(ADSENSE_SRC)) return true
	}

	return false
}

test.describe('AdSense script placement', () => {
	test('present on /about', async ({ page }) => {
		await page.goto(TEST_ROUTES.ABOUT, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(true)
	})

	test('present on /blog list', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(true)
	})

	test('present on /blog/[slug]', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(true)
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
