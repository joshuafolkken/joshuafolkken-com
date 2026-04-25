import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from './test-routes'

const REVEAL_SECTION = 'section.reveal-on-scroll'

test.describe('Scroll reveal animation', () => {
	test('section gets revealed class after scrolling into view', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const section = page.locator(REVEAL_SECTION).first()

		await section.scrollIntoViewIfNeeded()

		await expect(section).toHaveClass(/revealed/u)
	})
})
