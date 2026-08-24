import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const YOUTUBE_DATE_TESTID = 'youtube-date'
const TALK_META_TESTID = 'talk-meta'
const EXPECTED_YOUTUBE_DATE = '2026-01-22'

// Every assertion here is scoped to where the article states its own date — the talk sidebar, or
// the article body. The related-posts section at the foot of the page carries the dates of three
// *other* posts, so a page-wide locator would answer a different question than these tests ask.

test.describe('YouTube date: blog article page', () => {
	test('renders the youtube upload date for a post with a youtube_date frontmatter field', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const youtube_date = page.getByTestId(TALK_META_TESTID).getByTestId(YOUTUBE_DATE_TESTID)

		await expect(youtube_date).toBeVisible()
		await expect(youtube_date).toContainText(EXPECTED_YOUTUBE_DATE)
	})

	test('marks the youtube date as a machine-readable time element', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(
			page.getByTestId(TALK_META_TESTID).getByTestId(YOUTUBE_DATE_TESTID),
		).toHaveAttribute('datetime', EXPECTED_YOUTUBE_DATE)
	})

	test('does not render a youtube date for a post without a youtube_date field', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.locator('article').getByTestId(YOUTUBE_DATE_TESTID)).toHaveCount(0)
	})
})
