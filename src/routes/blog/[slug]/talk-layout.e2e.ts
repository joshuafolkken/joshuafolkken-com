import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const STICKY_VIDEO_TESTID = 'talk-sticky-video'
const META_TESTID = 'talk-meta'
const EMBED_TESTID = 'youtube-embed'
const NOTICE_TESTID = 'youtube-transcript-notice'
const DATE_TESTID = 'date-display'
const PAGE_HEADER_TEXT = 'Unwritten Chapters'
const JUSTIFY_CONTENT = 'justify-content'
const MOBILE_VIEWPORT = { width: 390, height: 800 }
const DESKTOP_VIEWPORT = { width: 1280, height: 900 }
// The desktop video pane is the 28rem (448px) grid track — guard the widened value, not 20rem (320px).
const PANE_MIN_WIDTH = 400
const PANE_MAX_WIDTH = 500

test.describe('Talk article layout', () => {
	test('pins the sticky video and the meta sidebar on a talk article page', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(page.getByTestId(STICKY_VIDEO_TESTID)).toHaveCount(1)
		await expect(page.getByTestId(META_TESTID)).toBeVisible()
	})

	test('embeds the playable player and the transcript notice in the sidebar', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const meta = page.getByTestId(META_TESTID)

		await expect(meta.getByTestId(EMBED_TESTID)).toHaveCount(1)
		await expect(meta.getByTestId(NOTICE_TESTID)).toBeVisible()
	})

	test('renders the sidebar player flush, without extra vertical margin', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const embed = page.getByTestId(META_TESTID).getByTestId(EMBED_TESTID)

		await expect(embed).toHaveCSS('margin-top', '0px')
		await expect(embed).toHaveCSS('margin-bottom', '0px')
	})

	test('drops the Blog page header on a talk article page', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(page.getByText(PAGE_HEADER_TEXT)).toHaveCount(0)
	})

	test('keeps the standard layout with page header for a non-talk post', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.getByTestId(META_TESTID)).toHaveCount(0)
		await expect(page.getByText(PAGE_HEADER_TEXT)).toBeVisible()
	})
})

test.describe('Talk article layout: responsive meta panel', () => {
	test('widens the video pane on desktop', async ({ page }) => {
		await page.setViewportSize(DESKTOP_VIEWPORT)
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const box = await page.getByTestId(META_TESTID).boundingBox()

		expect(box?.width ?? 0).toBeGreaterThan(PANE_MIN_WIDTH)
		expect(box?.width ?? 0).toBeLessThan(PANE_MAX_WIDTH)
	})

	test('right-aligns the date row on mobile', async ({ page }) => {
		await page.setViewportSize(MOBILE_VIEWPORT)
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const date_display = page.getByTestId(META_TESTID).getByTestId(DATE_TESTID)

		await expect(date_display).toHaveCSS(JUSTIFY_CONTENT, 'flex-end')
	})

	test('left-aligns the date row on desktop', async ({ page }) => {
		await page.setViewportSize(DESKTOP_VIEWPORT)
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		const date_display = page.getByTestId(META_TESTID).getByTestId(DATE_TESTID)

		await expect(date_display).toHaveCSS(JUSTIFY_CONTENT, 'flex-start')
	})
})
