import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from './test-routes'

const COPY_BUTTON_ARIA_LABEL = 'Copy Link'
const COPIED_TEXT = 'Copied!'

test.describe('CopyButton', () => {
	test('renders Copy Link button on blog post page', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		const copy_button = page.getByRole('button', { name: COPY_BUTTON_ARIA_LABEL })

		await expect(copy_button).toBeVisible()
	})

	test('shows copied state after clicking', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		const copy_button = page.getByRole('button', { name: COPY_BUTTON_ARIA_LABEL })

		await copy_button.click()

		await expect(page.getByText(COPIED_TEXT)).toBeVisible()
	})
})
