import { expect, test } from '@playwright/test'

const HOME_PATH = '/'
const CYBER_GLOW_HOVER_CLASS = 'cyber-glow-hover'

const NARROW_VIEWPORT_WIDTH = 640
const NARROW_VIEWPORT_HEIGHT = 800

const DRAWER_TESTID = 'nav-drawer'
const MENU_OPEN_ARIA_LABEL = 'メニューを開く'

const MNEMECHA_PATH = '/projects/mnemecha'
const MNEMECHA_TITLE = 'Mnemecha'

const DESKTOP_SOCIAL_NAV_LABEL = 'ソーシャルリンク'

const X_HREF = 'https://x.com/joshuafolkken'
const DISCORD_HREF = 'https://discord.gg/JdFywJmaSj'
const YOUTUBE_HREF = 'https://www.youtube.com/@Joshuafolkken-studio'
const GITHUB_HREF = 'https://github.com/joshuafolkken'

const SOCIAL_LINK_COUNT = 4

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

test.describe('Header social links', () => {
	test('lists links in X, Discord, YouTube, GitHub order with expected URLs', async ({ page }) => {
		await page.goto(HOME_PATH)

		const social_nav = page.getByRole('navigation', {
			name: DESKTOP_SOCIAL_NAV_LABEL,
			exact: true,
		})
		const social_links = social_nav.getByRole('link')

		await expect(social_links).toHaveCount(SOCIAL_LINK_COUNT)
		await expect(social_links.nth(0)).toHaveAttribute('href', X_HREF)
		await expect(social_links.nth(1)).toHaveAttribute('href', DISCORD_HREF)
		await expect(social_links.nth(2)).toHaveAttribute('href', YOUTUBE_HREF)
		await expect(social_links.nth(3)).toHaveAttribute('href', GITHUB_HREF)
	})
})
