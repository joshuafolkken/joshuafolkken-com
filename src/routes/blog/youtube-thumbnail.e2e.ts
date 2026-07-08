import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const THUMBNAIL_TESTID = 'youtube-thumbnail'

test.describe('YouTube thumbnail: blog list page', () => {
	test('shows a YouTube mark thumbnail for a post with a youtube field', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG)

		await expect(page.getByTestId(THUMBNAIL_TESTID).first()).toBeVisible()
	})

	test('shows the YouTube mark inside the card linking to the article', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG)

		const article_card = page.locator(`a[href="${TEST_ROUTES.BLOG_YOUTUBE_POST}"]`)

		await expect(article_card.getByTestId(THUMBNAIL_TESTID)).toBeVisible()
	})
})
