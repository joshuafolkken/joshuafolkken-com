import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const SKIP_LINK_TEXT = 'Skip to main content'
const SKIP_LINK_TARGET_ID = 'skip-to-main'
const MENU_OPEN_ARIA_LABEL = 'メニューを開く'

const NARROW_VIEWPORT_WIDTH = 640
const NARROW_VIEWPORT_HEIGHT = 800

test.describe('Skip navigation link', () => {
	test('is visually hidden by default', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const skip_link = page.getByRole('link', { name: SKIP_LINK_TEXT })

		await expect(skip_link).toBeAttached()
		await expect(skip_link).toHaveCSS('width', '1px')
	})

	test('becomes visible on keyboard focus', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await page.keyboard.press('Tab')

		await expect(page.getByRole('link', { name: SKIP_LINK_TEXT })).toBeVisible()
	})

	test('navigates to main content element when activated', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await page.keyboard.press('Tab')
		await page.keyboard.press('Enter')

		await expect(page.locator(`#${SKIP_LINK_TARGET_ID}`)).toBeAttached()
	})
})

test.describe('Mobile nav drawer keyboard accessibility', () => {
	test('Escape key closes the open drawer', async ({ page }) => {
		await page.setViewportSize({ width: NARROW_VIEWPORT_WIDTH, height: NARROW_VIEWPORT_HEIGHT })
		await page.goto(TEST_ROUTES.HOME)
		await page.waitForLoadState('networkidle')

		await page.getByRole('button', { name: MENU_OPEN_ARIA_LABEL }).click()

		const drawer = page.getByTestId('nav-drawer')

		await expect(drawer).toHaveClass(/translate-x-0/u)

		await page.keyboard.press('Escape')

		await expect(drawer).toHaveClass(/translate-x-full/u)
	})

	test('main content has inert attribute when drawer is open', async ({ page }) => {
		await page.setViewportSize({ width: NARROW_VIEWPORT_WIDTH, height: NARROW_VIEWPORT_HEIGHT })
		await page.goto(TEST_ROUTES.HOME)
		await page.waitForLoadState('networkidle')

		await expect(page.locator(`#${SKIP_LINK_TARGET_ID}`)).not.toHaveAttribute('inert')

		await page.getByRole('button', { name: MENU_OPEN_ARIA_LABEL }).click()

		await expect(page.locator(`#${SKIP_LINK_TARGET_ID}`)).toHaveAttribute('inert')
	})
})
