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

	// Regression for #803: Cross-Origin-Opener-Policy: same-origin severs the opener link for
	// cross-origin popups. The share links never used the opener (rel="noopener"), so opening a
	// new tab must keep working under the header — this is the compatibility claim the COOP
	// adoption rests on, asserted instead of assumed. The external site itself is stubbed out.
	test('opens the share target in a new tab under Cross-Origin-Opener-Policy', async ({
		page,
		context,
	}) => {
		await context.route(`${TWITTER_SHARE_URL_PREFIX}*`, async (route) => {
			await route.fulfill({ contentType: 'text/html', body: '<title>stub</title>' })
		})
		await page.goto(TEST_ROUTES.BLOG_POST)

		const popup_promise = context.waitForEvent('page')

		await page.getByRole('link', { name: TWITTER_ARIA_LABEL }).click()

		const popup = await popup_promise

		await popup.waitForLoadState('domcontentloaded')
		expect(popup.url()).toMatch(new RegExp(`^${TWITTER_SHARE_URL_PREFIX}`, 'u'))
		// The original page must stay live after the popup opens — COOP severing the opener
		// relationship must not take the referring document down with it.
		await expect(page.getByRole('link', { name: TWITTER_ARIA_LABEL })).toBeVisible()
	})
})
