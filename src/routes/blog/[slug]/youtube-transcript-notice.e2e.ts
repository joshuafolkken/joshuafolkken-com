import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const NOTICE_TESTID = 'youtube-transcript-notice'

test.describe('YouTube transcript notice: blog article page', () => {
	test('renders the provenance notice for a post with a youtube frontmatter field', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(page.getByTestId(NOTICE_TESTID)).toBeVisible()
	})

	test('links the notice to the source youtube video', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const link = page.getByTestId(NOTICE_TESTID).locator('a')

		await expect(link).toHaveAttribute('href', /youtube\.com|youtu\.be/u)
	})

	test('does not render the notice for a post without a youtube field', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.getByTestId(NOTICE_TESTID)).toHaveCount(0)
	})
})
