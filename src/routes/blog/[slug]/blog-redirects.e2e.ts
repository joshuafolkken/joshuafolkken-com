import { expect, test } from '@playwright/test'

const LEGACY_SIMON_PATH = '/blog/simon'
const CANONICAL_MNEMECHA_PATH = '/blog/mnemecha'
const LEGACY_TALK_PATH = '/blog/talk-2025-12-12'
const CANONICAL_TALK_PATH = '/blog/talk-2025-12-11'
const HTTP_PERMANENT_REDIRECT = 308

test.describe('Blog legacy slug redirects', () => {
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
