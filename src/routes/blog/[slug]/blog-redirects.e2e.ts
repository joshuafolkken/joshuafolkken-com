import { expect, test } from '@playwright/test'

const LEGACY_SIMON_PATH = '/blog/simon'
const CANONICAL_MNEMECHA_PATH = '/blog/mnemecha'
const LEGACY_TALK_PATH = '/blog/talk-2025-12-12'
const CANONICAL_TALK_PATH = '/blog/talk-2025-12-11'
const MERGED_ORM_PATH = '/blog/like-button-orm'
const CANONICAL_LIKE_BUTTON_PATH = '/blog/like-button'
// Distinctive to the merged article, so this asserts the surviving post is the merged one and not
// just any page that happens to answer at the canonical URL.
const MERGED_HEADING_PATTERN = /いいねボタンを作ってから/u
const HTTP_PERMANENT_REDIRECT = 308

test.describe('Blog legacy slug redirects — renames', () => {
	test(`GET ${LEGACY_SIMON_PATH} responds with status ${String(HTTP_PERMANENT_REDIRECT)}`, async ({
		request,
	}) => {
		const response = await request.get(LEGACY_SIMON_PATH, { maxRedirects: 0 })

		expect(response.status()).toBe(HTTP_PERMANENT_REDIRECT)
	})

	test(`following ${LEGACY_SIMON_PATH} lands on ${CANONICAL_MNEMECHA_PATH}`, async ({ page }) => {
		await page.goto(LEGACY_SIMON_PATH)

		await expect(page).toHaveURL(new RegExp(`${CANONICAL_MNEMECHA_PATH}$`, 'u'))
	})

	// Asserts the destination renders, not just that the URL changed: the defect being guarded is a
	// live URL turning into a 404, which a URL-only assertion would still pass.
	test(`following ${LEGACY_TALK_PATH} renders ${CANONICAL_TALK_PATH}`, async ({ page }) => {
		await page.goto(LEGACY_TALK_PATH)

		await expect(page).toHaveURL(new RegExp(`${CANONICAL_TALK_PATH}$`, 'u'))
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})
})

// A merge retires a URL for a different reason than a rename: the post is not renamed but absorbed,
// so its markdown file is deleted outright. Nothing inside the site still points at the retired
// slug afterwards — which is exactly what makes it easy to forget that the URL was public for nine
// months, and is what external links and search results still resolve to.
test.describe('Blog legacy slug redirects — merges', () => {
	// Regression for #837: the ORM post was merged into the like-button post, which now covers the
	// whole TURSO -> Drizzle -> D1 arc. The heading is matched by name rather than by level alone
	// because a regular post page carries two `h1` elements — the "Blog" page header and the article
	// title (#838) — so a level-only locator is ambiguous here.
	test(`following ${MERGED_ORM_PATH} renders ${CANONICAL_LIKE_BUTTON_PATH}`, async ({ page }) => {
		await page.goto(MERGED_ORM_PATH)

		await expect(page).toHaveURL(new RegExp(`${CANONICAL_LIKE_BUTTON_PATH}$`, 'u'))
		await expect(
			page.getByRole('heading', { level: 1, name: MERGED_HEADING_PATTERN }),
		).toBeVisible()
	})
})
