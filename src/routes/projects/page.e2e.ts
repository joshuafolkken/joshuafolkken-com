import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const MNEMECHA_TITLE = 'Mnemecha'
const KIT_TITLE = '@joshuafolkken/kit'
const BLOG_LABEL = 'Blog'
const GITHUB_LABEL = 'GitHub'
const KIT_GITHUB_URL = 'https://github.com/joshuafolkken/kit'
const KIT_BLOG_URL = '/blog/kit-package'
const CARD_SELECTOR = '.cyber-card'
const GODOT_2D_TITLE = 'Godot 2D Platformer'

test.describe('Projects page', () => {
	test('mnemecha card appears first on /projects', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		const first_card = page.locator(CARD_SELECTOR).first()

		await expect(first_card).toContainText(MNEMECHA_TITLE)
	})

	test('kit card is visible on /projects', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		await expect(page.getByText(KIT_TITLE)).toBeVisible()
	})

	test('kit card shows GitHub link on /projects', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		const kit_card = page.locator(CARD_SELECTOR).filter({ hasText: KIT_TITLE })
		const github_link = kit_card.locator(`a[href="${KIT_GITHUB_URL}"]`)

		await expect(github_link).toBeVisible()
	})

	test('kit card shows Blog link on /projects', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)
		await page.waitForLoadState('networkidle')

		const kit_card = page.locator(CARD_SELECTOR).filter({ hasText: KIT_TITLE })
		const blog_link = kit_card.getByRole('link', { name: BLOG_LABEL })

		await expect(blog_link).toBeVisible()
		await expect(blog_link).toHaveAttribute('href', KIT_BLOG_URL)
	})

	test(`${GODOT_2D_TITLE} is visible on /projects`, async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		await expect(page.getByText(GODOT_2D_TITLE)).toBeVisible()
	})
})

test.describe('Projects page detail navigation', () => {
	test('mnemecha card links to its detail page', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		const first_card = page.locator(CARD_SELECTOR).first()

		await first_card.locator('a[href="/projects/mnemecha"]').click()

		await expect(page).toHaveURL(/\/projects\/mnemecha$/u)
		await expect(page.locator('article h1')).toContainText(MNEMECHA_TITLE)
	})
})

test.describe('Projects page card links', () => {
	test('kit card links are icon-only (aria-label, no visible text)', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		const kit_card = page.locator(CARD_SELECTOR).filter({ hasText: KIT_TITLE })
		const github_link = kit_card.getByRole('link', { name: GITHUB_LABEL, exact: true })

		await expect(github_link).toBeVisible()
		await expect(github_link).toHaveAttribute('aria-label', GITHUB_LABEL)
	})
})

test.describe('Home page featured projects', () => {
	test('mnemecha card appears first in featured projects on /', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const first_card = page.locator(CARD_SELECTOR).first()

		await expect(first_card).toContainText(MNEMECHA_TITLE)
	})

	test('kit card is visible in featured projects on /', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await expect(page.getByText(KIT_TITLE)).toBeVisible()
	})

	test(`${GODOT_2D_TITLE} is not in featured projects on /`, async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await expect(page.getByText(GODOT_2D_TITLE)).not.toBeVisible()
	})
})
