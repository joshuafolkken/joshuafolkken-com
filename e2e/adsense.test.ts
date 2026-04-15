import { expect, test, type Page } from '@playwright/test'

const ADSENSE_SRC = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

const BLOG_PATH = '/blog'
const BLOG_POST_PATH = '/blog/driven-by-laziness'
const ABOUT_PATH = '/about'
const HOME_PATH = '/'
const PROJECTS_PATH = '/projects'
const CONTACT_PATH = '/contact'

async function has_adsense_script(page: Page): Promise<boolean> {
	const scripts = await page.locator('head script').all()

	for (const script of scripts) {
		const source = await script.getAttribute('src')

		if (source?.includes(ADSENSE_SRC)) return true
	}

	return false
}

test.describe('AdSense script placement', () => {
	test('present on /about', async ({ page }) => {
		await page.goto(ABOUT_PATH, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(true)
	})

	test('present on /blog list', async ({ page }) => {
		await page.goto(BLOG_PATH, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(true)
	})

	test('present on /blog/[slug]', async ({ page }) => {
		await page.goto(BLOG_POST_PATH, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(true)
	})

	test('absent on /', async ({ page }) => {
		await page.goto(HOME_PATH, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(false)
	})

	test('absent on /projects', async ({ page }) => {
		await page.goto(PROJECTS_PATH, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(false)
	})

	test('absent on /contact', async ({ page }) => {
		await page.goto(CONTACT_PATH, { waitUntil: 'domcontentloaded' })
		expect(await has_adsense_script(page)).toBe(false)
	})
})
