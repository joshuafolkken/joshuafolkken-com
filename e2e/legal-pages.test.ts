import { expect, test } from '@playwright/test'

const PRIVACY_PATH = '/privacy'
const TERMS_PATH = '/terms'
const LEGACY_PRIVACY_PATH = '/privacy-policy'

const PRIVACY_TITLE = 'Privacy Policy'
const TERMS_TITLE = 'Terms of Service'
const INTRODUCTION_HEADING = 'Introduction'

const HEADING_ROLE = 'heading'
const LINK_ROLE = 'link'

const LEVEL_1 = 1
const LEVEL_2 = 2

const LAST_UPDATED_PATTERN = /Last Updated:/u
const PRIVACY_URL_PATTERN = /\/privacy$/u
const TERMS_URL_PATTERN = /\/terms$/u

const RENDERS_H1_AND_LAST_UPDATED = 'renders h1 and Last Updated'

test.describe('Privacy Policy page', () => {
	test(RENDERS_H1_AND_LAST_UPDATED, async ({ page }) => {
		await page.goto(PRIVACY_PATH)

		await expect(
			page.getByRole(HEADING_ROLE, { level: LEVEL_1, name: PRIVACY_TITLE }),
		).toBeVisible()
		await expect(page.getByText(LAST_UPDATED_PATTERN)).toBeVisible()
	})

	test('introduction cross-links to Terms of Service', async ({ page }) => {
		await page.goto(PRIVACY_PATH)

		const intro_heading = page.getByRole(HEADING_ROLE, {
			level: LEVEL_2,
			name: INTRODUCTION_HEADING,
		})
		const intro_section = intro_heading.locator('..')
		const tos_link = intro_section.getByRole(LINK_ROLE, { name: TERMS_TITLE })

		await expect(tos_link).toBeVisible()
		await expect(tos_link).toHaveAttribute('href', TERMS_URL_PATTERN)
	})
})

test.describe('Terms of Service page', () => {
	test(RENDERS_H1_AND_LAST_UPDATED, async ({ page }) => {
		await page.goto(TERMS_PATH)

		await expect(page.getByRole(HEADING_ROLE, { level: LEVEL_1, name: TERMS_TITLE })).toBeVisible()
		await expect(page.getByText(LAST_UPDATED_PATTERN)).toBeVisible()
	})

	test('renders key sections', async ({ page }) => {
		await page.goto(TERMS_PATH)

		const section_titles = [
			'Acceptance of Terms',
			'Use of the Site',
			'Intellectual Property',
			'Disclaimers',
			'Limitation of Liability',
			'Governing Law and Jurisdiction',
			'Contact Us',
		]

		for (const title of section_titles) {
			await expect(page.getByRole(HEADING_ROLE, { level: LEVEL_2, name: title })).toBeVisible()
		}
	})

	test('links back to Privacy Policy in introduction', async ({ page }) => {
		await page.goto(TERMS_PATH)

		const intro_heading = page.getByRole(HEADING_ROLE, {
			level: LEVEL_2,
			name: INTRODUCTION_HEADING,
		})
		const intro_section = intro_heading.locator('..')
		const privacy_link = intro_section.getByRole(LINK_ROLE, { name: PRIVACY_TITLE })

		await expect(privacy_link).toBeVisible()
		await expect(privacy_link).toHaveAttribute('href', PRIVACY_URL_PATTERN)
	})
})

test.describe('Legacy /privacy-policy redirect', () => {
	test('redirects to /privacy', async ({ page }) => {
		await page.goto(LEGACY_PRIVACY_PATH)

		await expect(page).toHaveURL(PRIVACY_URL_PATTERN)
		await expect(
			page.getByRole(HEADING_ROLE, { level: LEVEL_1, name: PRIVACY_TITLE }),
		).toBeVisible()
	})
})

test.describe('Footer legal links', () => {
	test('home footer shows Privacy Policy and Terms of Service', async ({ page }) => {
		await page.goto('/')

		await expect(page.getByRole(LINK_ROLE, { name: PRIVACY_TITLE }).first()).toBeVisible()
		await expect(page.getByRole(LINK_ROLE, { name: TERMS_TITLE }).first()).toBeVisible()
	})

	test('Terms of Service link navigates to /terms', async ({ page }) => {
		await page.goto('/')

		await page.getByRole(LINK_ROLE, { name: TERMS_TITLE }).first().click()

		await expect(page).toHaveURL(TERMS_URL_PATTERN)
	})
})
