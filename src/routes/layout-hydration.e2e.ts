import { expect, test } from '@playwright/test'
import { test_hydration } from '$lib/test-hydration'
import { TEST_ROUTES } from '$lib/test-routes'

// Regression guard for the marker `goto_hydrated` waits on (#807). If the attribute ever stops
// appearing, every spec using the helper would time out at navigation with a clear selector in
// the error — this test pins the contract so that failure points here first.
test.describe('hydration marker', () => {
	test('is absent in the server-rendered HTML', async ({ request }) => {
		const response = await request.get(TEST_ROUTES.HOME)
		const html = await response.text()

		expect(html).not.toContain('data-hydrated')
	})

	test('appears on <main> once the client has hydrated', async ({ page }) => {
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await expect(page.locator(test_hydration.HYDRATED_SELECTOR)).toBeAttached()
	})
})
