import { expect, test, type Page } from '@playwright/test'

const ABOUT_PATH = '/about'

const HEADING_ROLE = 'heading'

const LEVEL_1 = 1
const LEVEL_2 = 2

const ABOUT_TITLE = 'About'
const MY_PROJECTS_HEADING = '🛠️ My Projects'
const CONNECT_HEADING = '🔗 Connect'
const THANKS_HEADING = '⭐️ Thanks for visiting! ⭐️'

const GITHUB_URL = 'https://github.com/joshuafolkken'
const GITHUB_PRS_URL =
	'https://github.com/joshuafolkken/joshuafolkken-com/pulls?q=is%3Apr+is%3Aclosed'
const SITE_URL = 'https://joshuafolkken.com'
const YOUTUBE_URL = 'https://www.youtube.com/@Joshuafolkken-studio'
const X_URL = 'https://x.com/joshuafolkken'
const OPENCOLLECTIVE_URL = 'https://opencollective.com/joshua-studio'

const BLANK_TARGET = '_blank'
const EXTERNAL_REL = 'noopener noreferrer'
const CORRECT_HREF_AND_REL = 'has correct href and rel attributes'
const HEADING_IS_VISIBLE = 'heading is visible'

const project_link_cases = [
	{ testid: 'about-github-profile-link', href: GITHUB_URL },
	{ testid: 'about-github-prs-link', href: GITHUB_PRS_URL },
	{ testid: 'about-github-page-link', href: SITE_URL },
]

const connect_link_cases = [
	{ testid: 'about-connect-github-link', href: GITHUB_URL },
	{ testid: 'about-connect-youtube-link', href: YOUTUBE_URL },
	{ testid: 'about-connect-x-link', href: X_URL },
	{ testid: 'about-connect-opencollective-link', href: OPENCOLLECTIVE_URL },
]

async function assert_external_link(page: Page, testid: string, href: string): Promise<void> {
	const link = page.getByTestId(testid)

	await expect(link).toBeVisible()
	await expect(link).toHaveAttribute('href', href)
	await expect(link).toHaveAttribute('target', BLANK_TARGET)
	await expect(link).toHaveAttribute('rel', EXTERNAL_REL)
}

test.describe('About page', () => {
	test('renders h1 About', async ({ page }) => {
		await page.goto(ABOUT_PATH)

		await expect(page.getByRole(HEADING_ROLE, { level: LEVEL_1, name: ABOUT_TITLE })).toBeVisible()
	})

	test('Philosophy section has a GitHub link below the bio', async ({ page }) => {
		await page.goto(ABOUT_PATH)
		await assert_external_link(page, 'about-philosophy-github-link', GITHUB_URL)
	})
})

test.describe('My Projects section', () => {
	test(HEADING_IS_VISIBLE, async ({ page }) => {
		await page.goto(ABOUT_PATH)

		await expect(
			page.getByRole(HEADING_ROLE, { level: LEVEL_2, name: MY_PROJECTS_HEADING }),
		).toBeVisible()
	})

	for (const { testid, href } of project_link_cases) {
		test(`${testid} ${CORRECT_HREF_AND_REL}`, async ({ page }) => {
			await page.goto(ABOUT_PATH)
			await assert_external_link(page, testid, href)
		})
	}
})

test.describe('Connect section', () => {
	test(HEADING_IS_VISIBLE, async ({ page }) => {
		await page.goto(ABOUT_PATH)

		await expect(
			page.getByRole(HEADING_ROLE, { level: LEVEL_2, name: CONNECT_HEADING }),
		).toBeVisible()
	})

	for (const { testid, href } of connect_link_cases) {
		test(`${testid} ${CORRECT_HREF_AND_REL}`, async ({ page }) => {
			await page.goto(ABOUT_PATH)
			await assert_external_link(page, testid, href)
		})
	}
})

test.describe('Thanks for visiting section', () => {
	test('"starring my repositories" is a clickable GitHub link', async ({ page }) => {
		await page.goto(ABOUT_PATH)

		await expect(
			page.getByRole(HEADING_ROLE, { level: LEVEL_2, name: THANKS_HEADING }),
		).toBeVisible()

		await assert_external_link(page, 'about-star-repositories-link', GITHUB_URL)
	})
})
