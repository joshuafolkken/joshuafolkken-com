import { expect, test } from '@playwright/test'

const HOME_PATH = '/'

const HEADING_ROLE = 'heading'
const LEVEL_2 = 2

const TECH_STACK = 'Tech Stack'
const FEATURED_PROJECTS = 'Featured Projects'
const SKILLS = 'Skills'
const DISCOVER = 'Discover'
const TOP_SUPPORTERS = 'Top Supporters'

const UNIFIED_HEADINGS = [TECH_STACK, FEATURED_PROJECTS, SKILLS, DISCOVER, TOP_SUPPORTERS]

const FORMERLY_CENTERED_HEADINGS = [DISCOVER, TOP_SUPPORTERS]

test.describe('Unified section headings', () => {
	for (const heading_name of UNIFIED_HEADINGS) {
		test(`${heading_name} heading renders with a sibling icon`, async ({ page }) => {
			await page.goto(HOME_PATH)

			const heading = page.getByRole(HEADING_ROLE, { level: LEVEL_2, name: heading_name })

			await expect(heading).toBeVisible()

			const heading_row = heading.locator('..')

			await expect(heading_row.locator('svg').first()).toBeVisible()
		})
	}

	for (const heading_name of FORMERLY_CENTERED_HEADINGS) {
		test(`${heading_name} heading is no longer centered`, async ({ page }) => {
			await page.goto(HOME_PATH)

			const heading = page.getByRole(HEADING_ROLE, { level: LEVEL_2, name: heading_name })

			await expect(heading).not.toHaveCSS('text-align', 'center')

			const heading_row = heading.locator('..')

			await expect(heading_row).not.toHaveCSS('justify-content', 'center')
		})
	}
})
