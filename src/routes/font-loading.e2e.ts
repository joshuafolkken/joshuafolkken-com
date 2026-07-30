import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const FONT_LINK_SELECTOR = 'link[data-font-css]'
const FONTS_GOOGLEAPIS_HREF = 'https://fonts.googleapis.com'
const FONTS_GSTATIC_HREF = 'https://fonts.gstatic.com'
const GOOGLE_FONTS_CSS_URL =
	'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap'

test.describe('Font loading strategy', () => {
	test('head contains preconnect hint for fonts.googleapis.com', async ({ page }) => {
		await page.goto('/')

		const preconnect = page.locator(`link[rel="preconnect"][href="${FONTS_GOOGLEAPIS_HREF}"]`)

		await expect(preconnect).toHaveCount(1)
	})

	test('head contains crossorigin preconnect hint for fonts.gstatic.com', async ({ page }) => {
		await page.goto('/')

		const preconnect = page.locator(`link[rel="preconnect"][href="${FONTS_GSTATIC_HREF}"]`)

		await expect(preconnect).toHaveCount(1)
	})

	test('head contains preload hint for Google Fonts CSS', async ({ page }) => {
		await page.goto('/')

		const preload = page.locator(`link[rel="preload"][as="style"][href="${GOOGLE_FONTS_CSS_URL}"]`)

		await expect(preload).toHaveCount(1)
	})
})

test.describe('Non-blocking font delivery', () => {
	test('Google Fonts stylesheet loads with media=print for non-blocking delivery', async ({
		page,
	}) => {
		// Check the raw SSR HTML: the app.html bootstrap swaps media to "all" after load,
		// so the live DOM reflects the post-load state, not the initial attribute.
		const response = await page.goto('/')
		const html = (await response?.text()) ?? ''

		// SvelteKit SSR HTML-encodes & as &amp; in attribute values
		expect(html).toContain(`href="${GOOGLE_FONTS_CSS_URL.replaceAll('&', '&amp;')}"`)
		expect(html).toContain('media="print"')
	})

	test('swaps the stylesheet to media="all" once it has loaded', async ({ page }) => {
		await page.goto('/')

		// Replaces the deleted `font_load_handler` unit test: the swap now runs from the
		// nonce-tagged bootstrap in app.html, so the only way to prove it works is to observe
		// the live DOM. Fails if the CSP blocks that script or the data-font-css hook is renamed.
		await expect(page.locator(FONT_LINK_SELECTOR)).toHaveAttribute('media', 'all')
	})

	test('renders the font link without an inline event-handler attribute', async ({ page }) => {
		const response = await page.goto('/')
		const html = (await response?.text()) ?? ''

		// Svelte 5 emits `this.__e=event` for onload/onerror on load/error elements, which is what
		// forced `script-src-attr 'unsafe-inline'` into the CSP before #799. Its absence is the
		// invariant that lets the directive stay unset.
		expect(html).not.toContain('this.__e=event')
	})

	test('head contains noscript fallback for browsers with JS disabled', async ({ page }) => {
		const response = await page.goto('/')
		const html = (await response?.text()) ?? ''

		// Verify the SSR HTML contains a <noscript> fallback so fonts load without JS
		expect(html).toContain('<noscript>')
		expect(html).toContain(GOOGLE_FONTS_CSS_URL.replaceAll('&', '&amp;'))
	})
})

test.describe('Font stylesheet across client-side navigation', () => {
	// The swap script runs once per document load, so the swapped link has to survive SPA
	// navigation. It does because the layout owns it — moving the link into a per-route
	// <svelte:head> would recreate it as media="print" with nothing left to swap it back.
	test('keeps the single swapped link when navigating without a reload', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator(FONT_LINK_SELECTOR)).toHaveAttribute('media', 'all')

		// Match on href: a link named "Blog" also matches post cards, which navigate to /blog/<slug>.
		await page.locator(`a[href="${TEST_ROUTES.BLOG}"]`).first().click()
		await page.waitForURL(new RegExp(`${TEST_ROUTES.BLOG}$`, 'u'))

		await expect(page.locator(FONT_LINK_SELECTOR)).toHaveCount(1)
		await expect(page.locator(FONT_LINK_SELECTOR)).toHaveAttribute('media', 'all')
	})
})
