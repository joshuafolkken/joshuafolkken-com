import { expect, test, type Locator, type Page } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

// One order, four surfaces. The point of the shared list is that reordering it moves all of them,
// so these specs read the rendered order rather than trusting that it was applied everywhere.
const ICON_ROW_ORDER = ['YouTube', 'X', 'Discord', 'GitHub']
const CONNECT_ORDER = ['YouTube', 'X (Twitter)', 'GitHub', 'Open Collective']

const HEADER_NAV = 'nav[aria-label="Social links"]'
const AUTHOR_NAV = 'nav[aria-label="Author profiles"]'
const CONTACT_NAV = 'ul:has(a[aria-label="YouTube"])'
const CONNECT_LINKS = '[data-testid^="about-connect-"]'

// The accessible name for an icon link, or the visible text where the link carries no icon.
async function rendered_order(scope: Locator): Promise<Array<string>> {
	return await scope.evaluateAll((links: Array<HTMLAnchorElement>) =>
		links.map((link) => link.getAttribute('aria-label') ?? link.textContent.trim()),
	)
}

async function icon_row_order(page: Page, selector: string): Promise<Array<string>> {
	return await rendered_order(page.locator(selector).first().getByRole('link'))
}

test.describe('Social link order', () => {
	test('leads with YouTube in the desktop header', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		expect(await icon_row_order(page, HEADER_NAV)).toStrictEqual(ICON_ROW_ORDER)
	})

	test('leads with YouTube in the author box at the end of an article', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		expect(await icon_row_order(page, AUTHOR_NAV)).toStrictEqual(ICON_ROW_ORDER)
	})

	test('leads with YouTube on the contact page', async ({ page }) => {
		await page.goto(TEST_ROUTES.CONTACT)

		expect(await icon_row_order(page, CONTACT_NAV)).toStrictEqual(ICON_ROW_ORDER)
	})

	test('follows the same order in the about page connect list', async ({ page }) => {
		await page.goto(TEST_ROUTES.ABOUT)

		expect(await rendered_order(page.locator(CONNECT_LINKS))).toStrictEqual(CONNECT_ORDER)
	})
})
