import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const ADSENSE_SCRIPT = 'script[src*="adsbygoogle.js"]'
const SHORT_POST = TEST_ROUTES.BLOG_THIN_POST
const LONG_POST = TEST_ROUTES.BLOG_POST

test.describe('AdSense visibility by content length', () => {
	test('omits the AdSense script on a short, low-value post', async ({ page }) => {
		await page.goto(SHORT_POST)

		await expect(page.locator(ADSENSE_SCRIPT)).toHaveCount(0)
	})

	test('keeps the AdSense script on a long, substantive post', async ({ page }) => {
		await page.goto(LONG_POST)

		await expect(page.locator(ADSENSE_SCRIPT)).toHaveCount(1)
	})
})
