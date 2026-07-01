import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const CONTACT_TITLE = 'Contact'
const EMAIL_ADDRESS = 'joshuafolkken@gmail.com'

const HEADING_ROLE = 'heading'
const LINK_ROLE = 'link'
const BUTTON_ROLE = 'button'

const LEVEL_1 = 1
const LEVEL_2 = 2

const CONTACT_URL_PATTERN = /\/contact$/u
const MAILTO_PATTERN = /^mailto:joshuafolkken@gmail\.com$/u

const SOCIAL_HEADING = 'Connect on social'
const REVEAL_BUTTON_NAME = /Reveal email address/u

const ICON_DEFAULT_TESTID = 'contact-email-reveal-icon-default'
const ICON_HOVER_TESTID = 'contact-email-reveal-icon-hover'

const X_HREF = 'https://x.com/joshuafolkken'
const DISCORD_HREF = 'https://discord.gg/JdFywJmaSj'
const GITHUB_HREF = 'https://github.com/joshuafolkken'
const YOUTUBE_HREF = 'https://www.youtube.com/@Joshuafolkken-studio'

const SOCIAL_LINK_COUNT = 4

test.describe('Contact page', () => {
	test('renders h1 Contact', async ({ page }) => {
		await page.goto(TEST_ROUTES.CONTACT)

		await expect(
			page.getByRole(HEADING_ROLE, { level: LEVEL_1, name: CONTACT_TITLE }),
		).toBeVisible()
	})

	test('does not leak the full email address in the initial HTML', async ({ page }) => {
		await page.goto(TEST_ROUTES.CONTACT)

		await expect(page.getByRole(BUTTON_ROLE, { name: REVEAL_BUTTON_NAME })).toBeVisible()

		expect(await page.content()).not.toContain(EMAIL_ADDRESS)
		expect(await page.content()).not.toContain('mailto:')
	})

	test('reveals the email address and mailto link after clicking reveal', async ({ page }) => {
		await page.goto(TEST_ROUTES.CONTACT)
		await page.waitForLoadState('networkidle')

		await page.getByRole(BUTTON_ROLE, { name: REVEAL_BUTTON_NAME }).click()

		const mailto_link = page.getByRole(LINK_ROLE, { name: new RegExp(EMAIL_ADDRESS, 'u') })

		await expect(mailto_link).toBeVisible()
		await expect(mailto_link).toHaveAttribute('href', MAILTO_PATTERN)
	})
})

test.describe('Contact social links', () => {
	test('lists links in X, Discord, YouTube, GitHub order with expected URLs', async ({ page }) => {
		await page.goto(TEST_ROUTES.CONTACT)

		const social_heading = page.getByRole(HEADING_ROLE, {
			level: LEVEL_2,
			name: SOCIAL_HEADING,
		})
		const social_section = social_heading.locator('..')
		const social_links = social_section.getByRole(LINK_ROLE)

		await expect(social_links).toHaveCount(SOCIAL_LINK_COUNT)
		await expect(social_links.nth(0)).toHaveAttribute('href', X_HREF)
		await expect(social_links.nth(1)).toHaveAttribute('href', DISCORD_HREF)
		await expect(social_links.nth(2)).toHaveAttribute('href', YOUTUBE_HREF)
		await expect(social_links.nth(3)).toHaveAttribute('href', GITHUB_HREF)
	})
})

test.describe('Reveal button hover affordance', () => {
	test('uses a pointer cursor', async ({ page }) => {
		await page.goto(TEST_ROUTES.CONTACT)

		await expect(page.getByRole(BUTTON_ROLE, { name: REVEAL_BUTTON_NAME })).toHaveCSS(
			'cursor',
			'pointer',
		)
	})

	test('swaps the icon on hover', async ({ page }) => {
		await page.goto(TEST_ROUTES.CONTACT)

		const default_icon = page.getByTestId(ICON_DEFAULT_TESTID)
		const hover_icon = page.getByTestId(ICON_HOVER_TESTID)

		await expect(default_icon).toBeVisible()
		await expect(hover_icon).toBeHidden()

		await page.getByRole(BUTTON_ROLE, { name: REVEAL_BUTTON_NAME }).hover()

		await expect(default_icon).toBeHidden()
		await expect(hover_icon).toBeVisible()
	})
})

test.describe('Footer Contact link', () => {
	test('home footer shows a Contact link that navigates to /contact', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const contact_link = page.getByRole(LINK_ROLE, { name: CONTACT_TITLE }).first()

		await expect(contact_link).toBeVisible()

		await contact_link.click()

		await expect(page).toHaveURL(CONTACT_URL_PATTERN)
	})
})
