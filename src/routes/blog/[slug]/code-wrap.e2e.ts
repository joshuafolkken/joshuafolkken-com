import { expect, test } from '@playwright/test'

// A blog post that renders a fenced code block (`pre`).
const CODE_POST_ROUTE = '/blog/to-pnpm'
// Long unbroken token to exercise the wrapping rule deterministically —
// wider than the prose container so it must wrap to avoid horizontal overflow.
const LONG_TOKEN_LENGTH = 200
// Sub-pixel rounding tolerance when comparing scrollWidth vs clientWidth.
const OVERFLOW_TOLERANCE_PX = 1

test.describe('Code block wrapping', () => {
	test('long unbroken token in a code block does not overflow horizontally', async ({ page }) => {
		await page.goto(CODE_POST_ROUTE)

		const pre = page.locator('pre').first()

		await expect(pre).toBeVisible()

		// Inject a single long unbroken token; `overflow-wrap: anywhere` must wrap it.
		await pre.evaluate((element, length) => {
			element.textContent = 'a'.repeat(length)
		}, LONG_TOKEN_LENGTH)

		const horizontal_overflow = await pre.evaluate(
			(element) => element.scrollWidth - element.clientWidth,
		)

		expect(horizontal_overflow).toBeLessThanOrEqual(OVERFLOW_TOLERANCE_PX)
	})
})
