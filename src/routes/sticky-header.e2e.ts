import { expect, test } from '@playwright/test'

const HOME_PATH = '/'
const CYBER_GLOW_HOVER_CLASS = 'cyber-glow-hover'

const NARROW_VIEWPORT_WIDTH = 640
const NARROW_VIEWPORT_HEIGHT = 800

const DRAWER_TESTID = 'nav-drawer'
const MENU_OPEN_ARIA_LABEL = 'メニューを開く'

const MNEMECHA_PATH = '/projects/mnemecha'
const MNEMECHA_TITLE = 'Mnemecha'

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

		const drawer = page.getByTestId(DRAWER_TESTID)
		const first_nav_link = drawer.getByRole('link').first()

		await expect(first_nav_link).toBeVisible()
		await expect(first_nav_link).toHaveClass(
			new RegExp(String.raw`\b${CYBER_GLOW_HOVER_CLASS}\b`, 'u'),
		)
	})

	test('shows the project title in the sticky header after scrolling on a project page', async ({
		page,
	}) => {
		await page.setViewportSize({
			width: NARROW_VIEWPORT_WIDTH,
			height: NARROW_VIEWPORT_HEIGHT,
		})
		await page.goto(MNEMECHA_PATH)

		const sticky_link = page.locator(`header a[href="${MNEMECHA_PATH}"]`)

		await expect(sticky_link).toBeHidden()

		await page.evaluate(() => {
			window.scrollTo(0, document.body.scrollHeight)
		})

		await expect(sticky_link).toBeVisible()
		await expect(sticky_link).toContainText(MNEMECHA_TITLE)
	})
})
