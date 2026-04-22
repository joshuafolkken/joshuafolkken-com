import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from './test-routes'

const KIT_TITLE = '@joshuafolkken/kit'
const BLOG_LABEL = 'Blog'
const GITHUB_LABEL = 'GitHub'
const KIT_GITHUB_URL = 'https://github.com/joshuafolkken/kit'
const KIT_BLOG_URL = '/blog/kit-package'
const CARD_SELECTOR = '.cyber-card'
const GODOT_2D_TITLE = 'Godot 2D Platformer'

test.describe('Projects page', () => {
	test('kit card appears first on /projects', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		const first_card = page.locator(CARD_SELECTOR).first()

		await expect(first_card).toContainText(KIT_TITLE)
	})

	test('kit card shows GitHub link on /projects', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		const first_card = page.locator(CARD_SELECTOR).first()
		const github_link = first_card.getByRole('link', { name: GITHUB_LABEL })

		await expect(github_link).toBeVisible()
		await expect(github_link).toHaveAttribute('href', KIT_GITHUB_URL)
	})

	test('kit card shows Blog link on /projects', async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		const first_card = page.locator(CARD_SELECTOR).first()
		const blog_link = first_card.getByRole('link', { name: BLOG_LABEL })

		await expect(blog_link).toBeVisible()
		await expect(blog_link).toHaveAttribute('href', KIT_BLOG_URL)
	})

	test(`${GODOT_2D_TITLE} is visible on /projects`, async ({ page }) => {
		await page.goto(TEST_ROUTES.PROJECTS)

		await expect(page.getByText(GODOT_2D_TITLE)).toBeVisible()
	})
})

test.describe('Home page featured projects', () => {
	test('kit card appears first in featured projects on /', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const first_card = page.locator(CARD_SELECTOR).first()

		await expect(first_card).toContainText(KIT_TITLE)
	})

	test('kit card shows GitHub link in featured projects on /', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		const first_card = page.locator(CARD_SELECTOR).first()
		const github_link = first_card.getByRole('link', { name: GITHUB_LABEL })

		await expect(github_link).toBeVisible()
		await expect(github_link).toHaveAttribute('href', KIT_GITHUB_URL)
	})

	test(`${GODOT_2D_TITLE} is not in featured projects on /`, async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await expect(page.getByText(GODOT_2D_TITLE)).not.toBeVisible()
	})
})
