import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '../test-routes'

const SIMON_TITLE = 'Simon'
const KIT_TITLE = '@joshuafolkken/kit'
const BLOG_LABEL = 'Blog'
const KIT_GITHUB_URL = 'https://github.com/joshuafolkken/kit'
const KIT_BLOG_URL = '/blog/kit-package'
const CARD_SELECTOR = '.cyber-card'
const GODOT_2D_TITLE = 'Godot 2D Platformer'

test.describe('Projects page', () => {
	test('simon card appears first on /projects', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		const first_card = page.locator(CARD_SELECTOR).first()

		await expect(first_card).toContainText(SIMON_TITLE)
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

test.describe('Home page featured projects', () => {
	test('simon card appears first in featured projects on /', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const first_card = page.locator(CARD_SELECTOR).first()

		await expect(first_card).toContainText(SIMON_TITLE)
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
