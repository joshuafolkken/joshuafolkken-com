import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const EMBED_SRC = 'https://www.youtube-nocookie.com/embed/UI3-GR6yvjY'
const EMBED_TESTID = 'youtube-embed'

test.describe('YouTube embed: blog article page', () => {
	test('renders the embed for a post with a youtube frontmatter field', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(page.getByTestId(EMBED_TESTID)).toBeVisible()
	})

	test('embeds the privacy-friendly nocookie URL for the video id', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(page.getByTestId(EMBED_TESTID).locator('iframe')).toHaveAttribute('src', EMBED_SRC)
	})

	test('does not render an embed for a post without a youtube field', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.getByTestId(EMBED_TESTID)).toHaveCount(0)
	})
})
