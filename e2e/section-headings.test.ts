import { expect, test } from '@playwright/test'

const HOME_PATH = '/'
const PROFILE_PATH = '/profile'

const HEADING_ROLE = 'heading'
const LEVEL_2 = 2

const TECH_STACK = 'Tech Stack'
const FEATURED_PROJECTS = 'Featured Projects'
const SKILLS = 'Skills'
const DISCOVER = 'Discover'
const TOP_SUPPORTERS = 'Top Supporters'

const UNIFIED_HEADINGS: ReadonlyArray<{ name: string; path: string }> = [
	{ name: TECH_STACK, path: PROFILE_PATH },
	{ name: FEATURED_PROJECTS, path: HOME_PATH },
	{ name: SKILLS, path: HOME_PATH },
	{ name: DISCOVER, path: HOME_PATH },
	{ name: TOP_SUPPORTERS, path: HOME_PATH },
]

const FORMERLY_CENTERED_HEADINGS: ReadonlyArray<{ name: string; path: string }> = [
	{ name: DISCOVER, path: HOME_PATH },
	{ name: TOP_SUPPORTERS, path: HOME_PATH },
]

test.describe('Unified section headings', () => {
	for (const { name, path } of UNIFIED_HEADINGS) {
		test(`${name} heading renders with a sibling icon`, async ({ page }) => {
			await page.goto(path)

			const heading = page.getByRole(HEADING_ROLE, { level: LEVEL_2, name })

			await expect(heading).toBeVisible()

			const heading_row = heading.locator('..')

			await expect(heading_row.locator('svg').first()).toBeVisible()
		})
	}

	for (const { name, path } of FORMERLY_CENTERED_HEADINGS) {
		test(`${name} heading is no longer centered`, async ({ page }) => {
			await page.goto(path)

			const heading = page.getByRole(HEADING_ROLE, { level: LEVEL_2, name })

			await expect(heading).not.toHaveCSS('text-align', 'center')

			const heading_row = heading.locator('..')

			await expect(heading_row).not.toHaveCSS('justify-content', 'center')
		})
	}
})
