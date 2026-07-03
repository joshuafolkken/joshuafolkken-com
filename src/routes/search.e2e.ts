import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const JAPANESE_QUERY = '記憶'
const UNKNOWN_QUERY = 'kangaroo'

const TRIGGER_TESTID = 'search-trigger'
const DIALOG_TESTID = 'search-dialog'
const INPUT_TESTID = 'search-input'
const RESULT_TESTID = 'search-result'

const MENU_OPEN_LABEL = 'メニューを開く'
// Header switches to the desktop nav at the `desktop` breakpoint (992px = 62rem).
const BELOW_DESKTOP_WIDTH = 960
const AT_DESKTOP_WIDTH = 1024
const VIEWPORT_HEIGHT = 800

const MAIN_SELECTOR = '#skip-to-main'
const SELECTED_SELECTOR = '[data-selected="true"]'
const COMMON_QUERY = 'こと'
const ARROW_PRESSES = 15

test.describe('Site search', () => {
	test('opens from the header trigger, finds a Japanese blog result, and navigates', async ({
		page,
	}) => {
		await page.goto(TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()

		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		await page.getByTestId(INPUT_TESTID).fill(JAPANESE_QUERY)

		const blog_result = page.locator(`[data-testid="${RESULT_TESTID}"][href*="/blog/"]`).first()

		await expect(blog_result).toBeVisible()

		await blog_result.click()

		await expect(page).toHaveURL(/\/blog\//u)
	})

	test('shows a no-results state for an unknown query', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await page.getByTestId(INPUT_TESTID).fill(UNKNOWN_QUERY)

		await expect(page.getByTestId('search-no-results')).toBeVisible()
	})

	test('opens with the keyboard shortcut and closes with Escape', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await page.keyboard.press('ControlOrMeta+k')
		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		await page.keyboard.press('Escape')
		await expect(page.getByTestId(DIALOG_TESTID)).not.toBeVisible()
	})
})

test.describe('Search dialog scroll lock', () => {
	test('locks page scroll while open and restores it on close', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

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
		await page.goto(TEST_ROUTES.HOME)

		await expect(page.getByTestId(TRIGGER_TESTID)).toContainText('Search')
	})
})

test.describe('Search dialog accessibility', () => {
	test('makes the page content inert while the dialog is open', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		await expect(page.locator(MAIN_SELECTOR)).toHaveAttribute('inert')
	})

	test('keeps the keyboard-selected result in view', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
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
		await page.goto(TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		await expect(page.getByTestId('site-header')).toHaveAttribute('inert')
	})

	test('restores focus to the trigger after closing', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME)

		await page.getByTestId(TRIGGER_TESTID).click()
		await expect(page.getByTestId(DIALOG_TESTID)).toBeVisible()

		await page.keyboard.press('Escape')

		await expect(page.getByTestId(TRIGGER_TESTID)).toBeFocused()
	})
})

test.describe('Header breakpoint', () => {
	test('collapses to the mobile layout below the desktop breakpoint', async ({ page }) => {
		await page.setViewportSize({ width: BELOW_DESKTOP_WIDTH, height: VIEWPORT_HEIGHT })
		await page.goto(TEST_ROUTES.HOME)

		await expect(page.getByTestId(TRIGGER_TESTID)).toBeHidden()
		await expect(page.getByRole('button', { name: MENU_OPEN_LABEL })).toBeVisible()
	})

	test('shows the desktop nav at the desktop breakpoint and above', async ({ page }) => {
		await page.setViewportSize({ width: AT_DESKTOP_WIDTH, height: VIEWPORT_HEIGHT })
		await page.goto(TEST_ROUTES.HOME)

		await expect(page.getByTestId(TRIGGER_TESTID)).toBeVisible()
	})
})
