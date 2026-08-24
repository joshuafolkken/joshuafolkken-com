import { expect, test, type Locator, type Page } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const RELATED_TESTID = 'related-posts'
const EXPECTED_CARDS = 3

function related_links(page: Page): Locator {
	return page.getByTestId(RELATED_TESTID).getByRole('link')
}

// Resolved through the DOM rather than read off the `href` attribute: a production build emits
// relative paths (`../blog/x`) where the dev server emits absolute ones, so an attribute selector
// matches nothing under `wrangler dev` and the assertion silently stops testing anything.
async function related_paths(page: Page): Promise<Array<string>> {
	return await related_links(page).evaluateAll((links: Array<HTMLAnchorElement>) =>
		links.map((link) => new URL(link.href).pathname),
	)
}

test.describe('Related posts', () => {
	test('lists other articles at the end of a standard post', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.getByTestId(RELATED_TESTID)).toBeVisible()
		await expect(related_links(page)).toHaveCount(EXPECTED_CARDS)
	})

	test('lists other articles at the end of a talk post', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST)

		await expect(related_links(page)).toHaveCount(EXPECTED_CARDS)
	})

	// A post below the content-length gate is excluded as a recommendation, but its own page still
	// needs somewhere to send the reader — that is the page most in need of an exit to a better one.
	test('lists other articles on a post that is itself too short to be recommended', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.BLOG_THIN_POST)

		await expect(related_links(page)).toHaveCount(EXPECTED_CARDS)
	})
})

test.describe('Related posts: what gets recommended', () => {
	test('never links back to the article being read', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)
		await expect(related_links(page)).toHaveCount(EXPECTED_CARDS)

		expect(await related_paths(page)).not.toContain(TEST_ROUTES.BLOG_POST)
	})

	test('never recommends a post that is too short to be indexed', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)
		await expect(related_links(page)).toHaveCount(EXPECTED_CARDS)

		expect(await related_paths(page)).not.toContain(TEST_ROUTES.BLOG_THIN_POST)
	})

	test('opens another article when a card is clicked', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)
		const [first_path] = await related_paths(page)

		await related_links(page).first().click()
		await page.waitForURL((url) => url.pathname === first_path)

		expect(new URL(page.url()).pathname).toBe(first_path)
	})
})
