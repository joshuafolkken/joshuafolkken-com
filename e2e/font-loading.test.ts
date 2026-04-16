import { expect, test } from '@playwright/test'

const FONTS_GOOGLEAPIS_HREF = 'https://fonts.googleapis.com'
const FONTS_GSTATIC_HREF = 'https://fonts.gstatic.com'
const GOOGLE_FONTS_CSS_URL =
	'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap'

test.describe('Font loading strategy', () => {
	test('head contains preconnect hint for fonts.googleapis.com', async ({ page }) => {
		await page.goto('/')

		const preconnect = page.locator(`link[rel="preconnect"][href="${FONTS_GOOGLEAPIS_HREF}"]`)

		await expect(preconnect).toHaveCount(1)
	})

	test('head contains crossorigin preconnect hint for fonts.gstatic.com', async ({ page }) => {
		await page.goto('/')

		const preconnect = page.locator(`link[rel="preconnect"][href="${FONTS_GSTATIC_HREF}"]`)

		await expect(preconnect).toHaveCount(1)
	})

	test('head contains preload hint for Google Fonts CSS', async ({ page }) => {
		await page.goto('/')

		const preload = page.locator(`link[rel="preload"][as="style"][href="${GOOGLE_FONTS_CSS_URL}"]`)

		await expect(preload).toHaveCount(1)
	})

	test('Google Fonts stylesheet loads with media=print for non-blocking delivery', async ({
		page,
	}) => {
		await page.goto('/')

		const stylesheet = page.locator(
			`link[rel="stylesheet"][media="print"][href="${GOOGLE_FONTS_CSS_URL}"]`,
		)

		await expect(stylesheet).toHaveCount(1)
	})
})
