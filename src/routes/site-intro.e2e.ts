import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

// Regression for #609. The landing page carried a name and a four-word tagline and nothing else in
// prose, which is what an AdSense reviewer and a first-time reader both land on. These assertions
// are about the section existing and its links resolving — the wording itself is expected to change.
const INTRO = '[data-testid="site-intro"]'
const HEADINGS = ['このサイトについて', 'ここで読めること', '作ってきたもの']
const MIN_INTRO_LENGTH = 600

test.describe('Home page intro section', () => {
	test('renders all three intro headings', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		for (const heading of HEADINGS) {
			await expect(page.getByRole('heading', { name: heading })).toBeVisible()
		}
	})

	// The point of the section is prose a crawler can read, so an empty shell with the right headings would
	// still be a failure. 600 characters is the floor the issue settled on.
	test('carries enough prose to describe the site', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const raw_text = await page.locator(INTRO).innerText()
		const text = raw_text.replaceAll(/\s/gu, '')

		expect(text.length).toBeGreaterThan(MIN_INTRO_LENGTH)
	})

	test('links into the blog, a representative post, and the projects page', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const intro = page.locator(INTRO)

		await expect(intro.locator('a[href="/blog"]')).toBeVisible()
		await expect(intro.locator('a[href="/blog/mnemecha"]')).toBeVisible()
		await expect(intro.locator('a[href="/projects"]')).toBeVisible()
	})

	// The server declares the landing page as English; these paragraphs are Japanese. Without the
	// marker a screen reader applies English pronunciation to them.
	test('marks the Japanese prose with its own lang', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await expect(page.locator(INTRO)).toHaveAttribute('lang', 'ja')
	})

	test('sits above the featured projects section', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const intro_box = await page.locator(INTRO).boundingBox()
		const featured_box = await page
			.getByRole('heading', { name: 'Featured Projects' })
			.boundingBox()

		expect(intro_box?.y).toBeLessThan(featured_box?.y ?? 0)
	})
})
