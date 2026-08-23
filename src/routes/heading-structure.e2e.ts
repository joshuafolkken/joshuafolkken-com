import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const HEADING_ROLE = 'heading'
const LEVEL_1 = 1
const BLOG_HEADING = 'Blog'
const TITLE_TESTID = 'page-header-title'
const HEADER_TITLE_AS_HEADING = `h1[data-testid="${TITLE_TESTID}"]`
const HEADER_TITLE_AS_LABEL = `p[data-testid="${TITLE_TESTID}"]`

// Every page carries exactly one top-level heading, so its topic reaches search engines and screen
// readers as a single signal. Blog post pages used to break this: the "Blog" page header stayed an
// `h1` alongside the article title, leaving two competing top-level headings (#838).
const SINGLE_H1_ROUTES = [
	TEST_ROUTES.HOME,
	TEST_ROUTES.BLOG,
	TEST_ROUTES.BLOG_POST,
	TEST_ROUTES.BLOG_YOUTUBE_POST,
	TEST_ROUTES.ABOUT,
	TEST_ROUTES.PROJECTS,
	TEST_ROUTES.CONTACT,
] as const

test.describe('Heading structure: one h1 per page', () => {
	for (const route of SINGLE_H1_ROUTES) {
		test(`${route} renders exactly one h1`, async ({ page }) => {
			await page.goto(route)

			await expect(page.getByRole(HEADING_ROLE, { level: LEVEL_1 })).toHaveCount(1)
		})
	}
})

test.describe('Heading structure: blog post pages', () => {
	// Matching against the document title keeps the assertion independent of the fixture post's
	// wording, which is editorial and changes without touching this spec.
	test('the only h1 on a post page is the article title', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		const heading_content = await page.getByRole(HEADING_ROLE, { level: LEVEL_1 }).innerText()
		const heading_text = heading_content.trim()
		const document_title = await page.title()

		expect(heading_text).not.toBe(BLOG_HEADING)
		expect(document_title).toContain(heading_text)
	})

	test('the Blog page header stays visible as a non-heading label', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG_POST)

		await expect(page.locator(HEADER_TITLE_AS_LABEL)).toBeVisible()
		await expect(page.locator(HEADER_TITLE_AS_HEADING)).toHaveCount(0)
	})

	test('the Blog listing page keeps its page header as the h1', async ({ page }) => {
		await page.goto(TEST_ROUTES.BLOG)

		await expect(page.locator(HEADER_TITLE_AS_HEADING)).toBeVisible()
		await expect(page.locator(HEADER_TITLE_AS_LABEL)).toHaveCount(0)
	})
})
