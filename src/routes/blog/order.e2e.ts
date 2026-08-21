import { expect, test, type Locator } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const DATE_DISPLAY_TESTID = 'date-display'
const PUBLISHED_TIME = '[data-testid="published-date"]'
const UPDATED_TIME = '[data-testid="updated-date"]'

async function read_effective_time(card: Locator): Promise<number> {
	const updated = card.locator(UPDATED_TIME)
	const has_update = (await updated.count()) > 0
	const time_element = has_update ? updated : card.locator(PUBLISHED_TIME)

	return new Date((await time_element.getAttribute('datetime')) ?? '').getTime()
}

test.describe('Blog list order', () => {
	test('orders cards by the updated date when present, otherwise the published date', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.BLOG)

		const date_displays = page.getByTestId(DATE_DISPLAY_TESTID)

		await expect(date_displays.first()).toBeVisible()

		const cards = await date_displays.all()
		const effective_times = await Promise.all(
			cards.map(async (card) => await read_effective_time(card)),
		)
		const updated_count = await page
			.locator(`[data-testid="${DATE_DISPLAY_TESTID}"] ${UPDATED_TIME}`)
			.count()

		// Without at least one revised post the ordering assertion would also hold for published-date
		// ordering, so the guard would no longer detect a regression.
		expect(updated_count).toBeGreaterThan(0)
		expect(effective_times).toEqual(effective_times.toSorted((time_a, time_b) => time_b - time_a))
	})
})
