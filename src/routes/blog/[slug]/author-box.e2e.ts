import { expect, test, type Locator, type Page } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const AUTHOR_BOX_TESTID = 'author-box'
const ABOUT_LINK_TESTID = 'author-box-about-link'
const AUTHOR_NAME = 'Joshua Folkken'

// Expected values written out here, as every sibling spec does (`sticky-header.e2e.ts`,
// `about/page.e2e.ts`): a Playwright spec runs outside Vite, so importing `$lib/app` to read
// `URLS` fails on `import.meta.env`.
const GITHUB_URL = 'https://github.com/joshuafolkken'
const YOUTUBE_URL = 'https://www.youtube.com/@Joshuafolkken-studio'
const X_URL = 'https://x.com/joshuafolkken'

function author_box(page: Page): Locator {
	return page.getByTestId(AUTHOR_BOX_TESTID)
}

// Resolved through the DOM rather than read off the `href` attribute, for the reason recorded in
// `related-posts.e2e.ts`: a production build emits relative internal paths where the dev server
// emits absolute ones, so an attribute selector quietly matches nothing under `wrangler dev`.
async function box_link_urls(page: Page): Promise<Array<string>> {
	return await author_box(page)
		.getByRole('link')
		.evaluateAll((links: Array<HTMLAnchorElement>) => links.map((link) => link.href))
}

test.describe('Author box', () => {
	test('introduces the author at the end of a standard post', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(author_box(page)).toBeVisible()
		await expect(author_box(page)).toContainText(AUTHOR_NAME)
	})

	test('introduces the author at the end of a talk post', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(author_box(page)).toBeVisible()
		await expect(author_box(page)).toContainText(AUTHOR_NAME)
	})

	test('opens the about page from the article', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await author_box(page).getByTestId(ABOUT_LINK_TESTID).click()
		await page.waitForURL((url) => url.pathname === TEST_ROUTES.ABOUT)

		expect(new URL(page.url()).pathname).toBe(TEST_ROUTES.ABOUT)
	})

	// The component renders these through the shared social-link data rather than writing its own
	// anchors, so this also guards the day one of those addresses moves.
	test('links to the profiles the site already publishes', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		const urls = await box_link_urls(page)

		expect(urls).toContain(GITHUB_URL)
		expect(urls).toContain(YOUTUBE_URL)
		expect(urls).toContain(X_URL)
	})
})
