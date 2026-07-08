import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const YOUTUBE_DATE_TESTID = 'youtube-date'

test.describe('YouTube date: blog list page', () => {
	test('renders the youtube upload date on cards for youtube-derived posts', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG)

		const youtube_dates = page.getByTestId(YOUTUBE_DATE_TESTID)

		await expect(youtube_dates.first()).toBeVisible()
	})
})
