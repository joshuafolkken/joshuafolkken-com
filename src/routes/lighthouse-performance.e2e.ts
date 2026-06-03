import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

const SKILL_BAR_SELECTOR = '.skill-bar'

test('hero background image has preload hint with high fetchpriority', async ({ page }) => {
	await page.goto(TEST_ROUTES.HOME)

	const preload = page.locator('link[rel="preload"][as="image"][fetchpriority="high"]')

	await expect(preload).toHaveCount(1)
})

test('skill bar animates using transform instead of width', async ({ page }) => {
	await page.goto(TEST_ROUTES.HOME)

	const skill_bar = page.locator(SKILL_BAR_SELECTOR).first()

	await skill_bar.scrollIntoViewIfNeeded()

	const transition = await skill_bar.evaluate((element) => getComputedStyle(element).transition)

	expect(transition).toContain('transform')
	expect(transition).not.toContain('width')
})

test('reveal-on-scroll elements do not apply filter blur', async ({ page }) => {
	await page.goto(TEST_ROUTES.HOME)

	const filter = await page
		.locator('.reveal-on-scroll')
		.first()
		.evaluate((element) => getComputedStyle(element).filter)

	expect(filter).not.toContain('blur')
})

test('card images use loading="lazy"', async ({ page }) => {
	await page.goto(TEST_ROUTES.HOME)

	const card_images = page.locator('.aspect-video img')
	const count = await card_images.count()

	expect(count).toBeGreaterThan(0)

	for (let index = 0; index < count; index++) {
		await expect(card_images.nth(index)).toHaveAttribute('loading', 'lazy')
	}
})

test('blog post cover image uses loading="lazy"', async ({ page }) => {
	await page.goto(TEST_ROUTES.BLOG_POST)

	const cover_img = page.locator('article img').first()

	await expect(cover_img).toHaveAttribute('loading', 'lazy')
})

test('skill bar shimmer uses composited transform instead of left', async ({ page }) => {
	await page.goto(TEST_ROUTES.HOME)

	const skill_bar = page.locator(SKILL_BAR_SELECTOR).first()

	await skill_bar.scrollIntoViewIfNeeded()

	const shimmer_left = await skill_bar.evaluate((element) => {
		const pseudo = getComputedStyle(element, '::after')

		return pseudo.left
	})

	expect(shimmer_left).toBe('0px')
})
