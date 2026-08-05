import { expect, test, type Page } from '@playwright/test'
import { test_hydration } from '$lib/test-hydration'
import { TEST_ROUTES } from '$lib/test-routes'

const JAPANESE_QUERY = '記憶'
const UNKNOWN_QUERY = 'kangaroo'

const TRIGGER_TESTID = 'search-trigger'
const DIALOG_TESTID = 'search-dialog'
const INPUT_TESTID = 'search-input'
const RESULT_TESTID = 'search-result'

const MENU_OPEN_LABEL = 'Open menu'
// Header switches to the desktop nav at the `desktop` breakpoint (992px = 62rem).
const BELOW_DESKTOP_WIDTH = 960
const AT_DESKTOP_WIDTH = 1024
const VIEWPORT_HEIGHT = 800

const MAIN_SELECTOR = '#skip-to-main'
const SELECTED_SELECTOR = '[data-selected="true"]'
const COMMON_QUERY = 'こと'
const ARROW_PRESSES = 15
const LOADING_TESTID = 'search-loading'
// The index endpoint compiles every post on its first hit, which on a cold dev server takes
// well over the 5s expect default — a startup latency, not a search defect. Tests that wait
// for it also need their own test budget raised past the 30s default (same pattern as the
// AdSense-route timeout in csp.e2e.ts).
const INDEX_READY_TIMEOUT_MS = 30_000
const INDEX_TEST_TIMEOUT_MS = 60_000

// Result and no-results assertions are meaningless while the index is still loading: the
// dialog says so via its loading state, so wait for that signal instead of racing it.
async function wait_search_ready(page: Page): Promise<void> {
	await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()
	await page
		.getByTestId(LOADING_TESTID)
		.waitFor({ state: 'detached', timeout: INDEX_READY_TIMEOUT_MS })
}

test.describe('Site search', () => {
	test('opens from the header trigger, finds a Japanese blog result, and navigates', async ({
		page,
	}) => {
		test.setTimeout(INDEX_TEST_TIMEOUT_MS)
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()

		await wait_search_ready(page)

		await page.getByTestId(INPUT_TESTID).fill(JAPANESE_QUERY)

		const blog_result = page.locator(`[data-testid="${RESULT_TESTID}"][href*="/blog/"]`).first()

		await expect(blog_result).toBeVisible()

		await blog_result.click()

		// waitForURL, not expect(page).toHaveURL: the clicked post's first compile on a cold dev
		// server can exceed the 5s expect window; the navigation timeout is the right budget (#807).
		await page.waitForURL(/\/blog\//u)
	})

	test('shows a no-results state for an unknown query', async ({ page }) => {
		test.setTimeout(INDEX_TEST_TIMEOUT_MS)
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await wait_search_ready(page)
		await page.getByTestId(INPUT_TESTID).fill(UNKNOWN_QUERY)

		await expect(page.getByTestId('search-no-results')).toBeVisible()
	})

	test('opens with the keyboard shortcut and closes with Escape', async ({ page }) => {
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await page.keyboard.press('ControlOrMeta+k')
		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		await page.keyboard.press('Escape')
		await expect(page.getByTestId(DIALOG_TESTID)).not.toBeVisible()
	})
})

test.describe('Search dialog scroll lock', () => {
	test('locks page scroll while open and restores it on close', async ({ page }) => {
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		const locked = await page.evaluate(() => getComputedStyle(document.documentElement).overflowY)

		expect(locked).toBe('hidden')

		await page.keyboard.press('Escape')
		await expect(page.getByTestId(DIALOG_TESTID)).not.toBeVisible()

		const restored = await page.evaluate(() => getComputedStyle(document.documentElement).overflowY)

		expect(restored).not.toBe('hidden')
	})
})

test.describe('Search trigger', () => {
	test('labels the desktop trigger with Search', async ({ page }) => {
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await expect(page.getByTestId(TRIGGER_TESTID)).toContainText('Search')
	})
})

test.describe('Search dialog accessibility', () => {
	test('makes the page content inert while the dialog is open', async ({ page }) => {
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		await expect(page.locator(MAIN_SELECTOR)).toHaveAttribute('inert')
	})

	test('keeps the keyboard-selected result in view', async ({ page }) => {
		test.setTimeout(INDEX_TEST_TIMEOUT_MS)
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await wait_search_ready(page)
		await page.getByTestId(INPUT_TESTID).fill(COMMON_QUERY)
		await expect(page.getByTestId(RESULT_TESTID).first()).toBeVisible()

		for (let press = 0; press < ARROW_PRESSES; press++) {
			await page.keyboard.press('ArrowDown')
		}

		await expect(page.locator(SELECTED_SELECTOR)).toBeInViewport()
	})
})

test.describe('Search dialog focus management', () => {
	test('makes the header inert while the dialog is open', async ({ page }) => {
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		await expect(page.getByTestId('site-header')).toHaveAttribute('inert')
	})

	test('restores focus to the trigger after closing', async ({ page }) => {
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		await page.keyboard.press('Escape')

		await expect(page.getByTestId(TRIGGER_TESTID)).toBeFocused()
	})
})

test.describe('Header breakpoint', () => {
	test('collapses to the mobile layout below the desktop breakpoint', async ({ page }) => {
		await page.setViewportSize({ width: BELOW_DESKTOP_WIDTH, height: VIEWPORT_HEIGHT })
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await expect(page.getByTestId(TRIGGER_TESTID)).toBeHidden()
		await expect(page.getByRole('button', { name: MENU_OPEN_LABEL })).toBeVisible()
	})

	test('shows the desktop nav at the desktop breakpoint and above', async ({ page }) => {
		await page.setViewportSize({ width: AT_DESKTOP_WIDTH, height: VIEWPORT_HEIGHT })
		await test_hydration.goto_hydrated(page, TEST_ROUTES.HOME)

		await expect(page.getByTestId(TRIGGER_TESTID)).toBeVisible()
	})
})
