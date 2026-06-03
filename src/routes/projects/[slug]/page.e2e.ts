import { expect, test } from '@playwright/test'
import { PROJECT_SLUGS } from '$lib/data/project-slugs'

const CHALLENGE_HEADING = 'The Challenge'
const NOT_FOUND_STATUS = 404
const MNEMECHA_LIVE_URL = 'https://mnemecha.joshuafolkken.com'
const MNEMECHA_PATH = '/projects/mnemecha'

test.describe('Project detail pages', () => {
	for (const slug of PROJECT_SLUGS) {
		test(`/projects/${slug} renders a case study`, async ({ page }) => {
			await page.goto(`/projects/${slug}`)

			await expect(page.getByRole('heading', { level: 1 }).first()).not.toBeEmpty()
			await expect(page.locator('article h1')).toHaveCount(0)
			await expect(page.getByRole('heading', { name: CHALLENGE_HEADING })).toBeVisible()
		})
	}

	test('shows the project title and subtitle in the page header', async ({ page }) => {
		await page.goto(MNEMECHA_PATH)

		await expect(page.getByRole('heading', { level: 1, name: 'Mnemecha' })).toBeVisible()
		await expect(page.getByText('Memory Game')).toBeVisible()
	})

	test('returns 404 for an unknown project slug', async ({ page }) => {
		const response = await page.goto('/projects/does-not-exist')

		expect(response?.status()).toBe(NOT_FOUND_STATUS)
	})

	test('a game project labels its live link as Play', async ({ page }) => {
		await page.goto(MNEMECHA_PATH)

		const play_link = page.locator(`a[href="${MNEMECHA_LIVE_URL}"]`)

		await expect(play_link).toBeVisible()
		await expect(play_link).toContainText('Play')
	})
})
