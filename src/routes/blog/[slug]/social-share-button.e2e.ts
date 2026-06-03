import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const TWITTER_SHARE_URL_PREFIX = 'https://twitter.com/intent/tweet'
const TWITTER_ARIA_LABEL = 'Share on X'

test.describe('SocialShareButton', () => {
	test('renders Twitter share link pointing to twitter.com with current page URL', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		const share_link = page.getByRole('link', { name: TWITTER_ARIA_LABEL })

		await expect(share_link).toBeVisible()

		const href = await share_link.getAttribute('href')

		expect(href).toMatch(new RegExp(`^${TWITTER_SHARE_URL_PREFIX}`, 'u'))
		expect(href).toContain(encodeURIComponent(TEST_ROUTES.BLOG_POST))
	})
})
