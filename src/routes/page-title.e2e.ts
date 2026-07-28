import { expect, test } from '@playwright/test'

// Every page composes its <title> through app.page_title, so one separator holds site-wide. These pages
// cover all three call shapes it replaced: a plain script const, a $derived one, and markup that used to
// build the title inline (#795).
const TITLED_PAGES = [
	{ path: '/about', title: 'About' },
	{ path: '/chat', title: 'AI Chat' },
	{ path: '/terms', title: 'Terms of Service' },
] as const

const AUTHOR_NAME = 'Joshua Folkken'

for (const { path, title } of TITLED_PAGES) {
	test(`${path} titles the page with an em dash separator`, async ({ page }) => {
		await page.goto(path)

		await expect(page).toHaveTitle(`${title} — ${AUTHOR_NAME}`)
	})
}

test('no page falls back to the old hyphen separator', async ({ page }) => {
	await page.goto('/projects')

	// A hyphen would be indistinguishable from the ones inside project and repo names (game-kit, app-kit).
	expect(await page.title()).not.toContain(` - ${AUTHOR_NAME}`)
})
