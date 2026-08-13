import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const THUMBNAIL_TESTID = 'youtube-thumbnail'
const BADGE_TESTID = 'youtube-badge'
const THUMBNAIL_URL_PATTERN = /^https:\/\/i\.ytimg\.com\/vi\//u

test.describe('YouTube thumbnail: blog list page', () => {
	test('shows a YouTube thumbnail for a post with a youtube field', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG)

		await expect(page.getByTestId(THUMBNAIL_TESTID).first()).toBeVisible()
	})

	test('shows the thumbnail inside the card linking to the article', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG)

		const article_card = page.locator(`a[href="${TEST_ROUTES.BLOG_YOUTUBE_POST}"]`)

		await expect(article_card.getByTestId(THUMBNAIL_TESTID)).toBeVisible()
	})

	// The card image comes from the video still, like every other post's cover image — a talk card
	// falling back to the plain mark placeholder would not carry this image element.
	test('renders the video still as the card image', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG)

		const thumbnail_image = page
			.locator(`a[href="${TEST_ROUTES.BLOG_YOUTUBE_POST}"]`)
			.getByTestId(THUMBNAIL_TESTID)
			.locator('img')

		await expect(thumbnail_image).toBeVisible()
		await expect(thumbnail_image).toHaveAttribute('src', THUMBNAIL_URL_PATTERN)
	})

	test('marks the card with a small YouTube badge over the still', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG)

		const badge = page
			.locator(`a[href="${TEST_ROUTES.BLOG_YOUTUBE_POST}"]`)
			.getByTestId(BADGE_TESTID)

		await expect(badge).toBeVisible()
	})
})

test.describe('YouTube thumbnail: article page', () => {
	// Talk posts have no cover image, so before the thumbnail fallback they shared with no image.
	test('uses the video still as the social preview image', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const og_image = page.locator('meta[property="og:image"]')

		await expect(og_image).toHaveAttribute('content', THUMBNAIL_URL_PATTERN)
	})
})
