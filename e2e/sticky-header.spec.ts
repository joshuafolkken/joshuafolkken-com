import { expect, test } from '@playwright/test'

const HOME_PATH = '/'
const CYBER_GLOW_HOVER_CLASS = 'cyber-glow-hover'

const NARROW_VIEWPORT_WIDTH = 640
const NARROW_VIEWPORT_HEIGHT = 800

const DRAWER_ARIA_LABEL = 'ナビゲーションメニュー'
const MENU_OPEN_ARIA_LABEL = 'メニューを開く'

test.describe('Sticky header drawer', () => {
	test('drawer nav links carry the cyber-glow-hover utility on narrow viewports', async ({
		page,
	}) => {
		await page.setViewportSize({
			width: NARROW_VIEWPORT_WIDTH,
			height: NARROW_VIEWPORT_HEIGHT,
		})
		await page.goto(HOME_PATH)

		await page.getByRole('button', { name: MENU_OPEN_ARIA_LABEL }).click()

		const drawer = page.locator(`aside[aria-label="${DRAWER_ARIA_LABEL}"]`)
		const first_nav_link = drawer.getByRole('link').first()

		await expect(first_nav_link).toBeVisible()
		await expect(first_nav_link).toHaveClass(
			new RegExp(String.raw`\b${CYBER_GLOW_HOVER_CLASS}\b`, 'u'),
		)
	})
})
