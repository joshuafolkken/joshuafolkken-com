import { expect, test, type Page } from '@playwright/test'
import { test_hydration } from '$lib/test-hydration'

const HOME_PATH = '/'
const CYBER_GLOW_HOVER_CLASS = 'cyber-glow-hover'

const NARROW_VIEWPORT_WIDTH = 640
const NARROW_VIEWPORT_HEIGHT = 800

const DRAWER_TESTID = 'nav-drawer'
const MENU_OPEN_ARIA_LABEL = 'Open menu'
const MENU_CLOSE_ARIA_LABEL = 'Close menu'

const CHAT_PATH = '/chat'
const CHAT_TRIGGER_TESTID = 'chat-trigger-mobile'
const HOME_LOGO_ARIA_LABEL = 'Home'

const ARIA_EXPANDED_ATTR = 'aria-expanded'
const ARIA_EXPANDED_CLOSED = 'false'

async function open_drawer_on(page: Page, path: string): Promise<void> {
	await page.setViewportSize({
		width: NARROW_VIEWPORT_WIDTH,
		height: NARROW_VIEWPORT_HEIGHT,
	})
	await test_hydration.goto_hydrated(page, path)
	await page.getByRole('button', { name: MENU_OPEN_ARIA_LABEL }).click()
	await expect(page.getByRole('button', { name: MENU_CLOSE_ARIA_LABEL })).toBeVisible()
}

async function expect_drawer_closed(page: Page): Promise<void> {
	await expect(page.getByRole('button', { name: MENU_OPEN_ARIA_LABEL })).toHaveAttribute(
		ARIA_EXPANDED_ATTR,
		ARIA_EXPANDED_CLOSED,
	)
}

const MNEMECHA_PATH = '/projects/mnemecha'
const MNEMECHA_TITLE = 'Mnemecha'

const DESKTOP_SOCIAL_NAV_LABEL = 'Social links'

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
		await test_hydration.goto_hydrated(page, HOME_PATH)

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
		// Scrolling is a one-shot interaction too: the sticky-title logic listens for scroll
		// events wired at hydration, so a pre-hydration scroll is never observed (#807).
		await test_hydration.goto_hydrated(page, MNEMECHA_PATH)

		const sticky_link = page.locator(`header a[href="${MNEMECHA_PATH}"]`)

		await expect(sticky_link).toBeHidden()

		await page.evaluate(() => {
			window.scrollTo(0, document.body.scrollHeight)
		})

		await expect(sticky_link).toBeVisible()
		await expect(sticky_link).toContainText(MNEMECHA_TITLE)
	})
})

test.describe('Sticky header drawer closes on navigation', () => {
	test('closes the drawer when navigating to the chat page via the mobile chat icon', async ({
		page,
	}) => {
		await open_drawer_on(page, HOME_PATH)

		await page.getByTestId(CHAT_TRIGGER_TESTID).click()

		await expect(page).toHaveURL(new RegExp(`${CHAT_PATH}$`, 'u'))
		await expect_drawer_closed(page)
	})

	test('closes the drawer when navigating to the top page via the logo', async ({ page }) => {
		await open_drawer_on(page, CHAT_PATH)

		await page.getByRole('link', { name: HOME_LOGO_ARIA_LABEL }).click()

		await expect(page).toHaveURL(new RegExp(`${HOME_PATH}$`, 'u'))
		await expect_drawer_closed(page)
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
