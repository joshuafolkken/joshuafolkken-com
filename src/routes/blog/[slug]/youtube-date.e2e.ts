import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const YOUTUBE_DATE_TESTID = 'youtube-date'
const EXPECTED_YOUTUBE_DATE = '2026-01-22'

test.describe('YouTube date: blog article page', () => {
	test('renders the youtube upload date for a post with a youtube_date frontmatter field', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const youtube_date = page.getByTestId(YOUTUBE_DATE_TESTID)

		await expect(youtube_date).toBeVisible()
		await expect(youtube_date).toContainText(EXPECTED_YOUTUBE_DATE)
	})

	test('marks the youtube date as a machine-readable time element', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(page.getByTestId(YOUTUBE_DATE_TESTID)).toHaveAttribute(
			'datetime',
			EXPECTED_YOUTUBE_DATE,
		)
	})

	test('does not render a youtube date for a post without a youtube_date field', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.getByTestId(YOUTUBE_DATE_TESTID)).toHaveCount(0)
	})
})
