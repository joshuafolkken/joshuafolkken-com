import { expect, test } from '@playwright/test'

const ADSENSE_SCRIPT = 'script[src*="adsbygoogle.js"]'
const SHORT_POST = '/blog/first-post'
const LONG_POST = '/blog/mnemecha'

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
