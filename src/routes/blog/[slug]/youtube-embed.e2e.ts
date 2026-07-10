import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const EMBED_SRC = 'https://www.youtube-nocookie.com/embed/UI3-GR6yvjY'
const EMBED_TESTID = 'youtube-embed'
const STICKY_VIDEO_TESTID = 'talk-sticky-video'

// The talk layout renders two players — the mobile sticky one and the desktop sidebar one — each
// gated by a breakpoint, so both are present in the DOM regardless of the viewport.
test.describe('YouTube embed: talk article players', () => {
	test('renders the sticky and sidebar players for a post with a youtube field', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(page.getByTestId(EMBED_TESTID)).toHaveCount(2)
	})

	test('embeds the privacy-friendly nocookie URL in the sticky player', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const sticky_iframe = page
			.getByTestId(STICKY_VIDEO_TESTID)
			.getByTestId(EMBED_TESTID)
			.locator('iframe')

		await expect(sticky_iframe).toHaveAttribute('src', EMBED_SRC)
	})

	test('does not render an embed for a post without a youtube field', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.getByTestId(EMBED_TESTID)).toHaveCount(0)
	})
})
