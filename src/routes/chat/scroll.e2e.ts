import { expect, test, type Page } from '@playwright/test'
import { CHAT_LABELS } from '$lib/constants/chat'

const CHAT_SCROLL_BOTTOM = 'chat-scroll-bottom'
const CHAT_TRIGGER_MOBILE = 'chat-trigger-mobile'
const STORAGE_KEY = 'chat_log'
const FOOTER_HEADING = 'Top Supporters'
const DESKTOP_WIDTH = 1280
const DESKTOP_HEIGHT = 800
// Below the 62rem desktop breakpoint the header exposes the mobile chat link used for in-app navigation.
const MOBILE_WIDTH = 390
const MOBILE_HEIGHT = 800
// The input sits ~1rem above the bottom (same as mobile); guard against a large floating gap.
const MAX_BOTTOM_GAP = 48
// Viewport height after the software keyboard shrinks it (well under DESKTOP_HEIGHT).
const HEIGHT_WITH_KEYBOARD = 460
const LONG_MESSAGE_COUNT = 40
// On page display the view must already sit at the bottom; allow only sub-pixel rounding slack.
const SCROLL_BOTTOM_TOLERANCE = 8
// After a client-side navigation SvelteKit resets scroll asynchronously, animating under
// `scroll-behavior: smooth`; wait until the position holds still before asserting where it landed.
const SCROLL_SETTLE_MS = 300

async function wait_for_scroll_settle(page: Page): Promise<void> {
	await page.evaluate(async (stable_ms) => {
		await new Promise<void>((resolve) => {
			let last_y = window.scrollY
			let stable_since = performance.now()

			function tick(now: number): void {
				if (window.scrollY !== last_y) {
					last_y = window.scrollY
					stable_since = now
				}

				if (now - stable_since >= stable_ms) resolve()
				else requestAnimationFrame(tick)
			}

			requestAnimationFrame(tick)
		})
	}, SCROLL_SETTLE_MS)
}

async function distance_from_bottom(page: Page): Promise<number> {
	return await page.evaluate(
		() => document.documentElement.scrollHeight - window.innerHeight - window.scrollY,
	)
}

async function seed_many_messages(page: Page, count: number): Promise<void> {
	await page.evaluate(
		({ key, total }) => {
			const log = Array.from({ length: total }, (_unused, index) => ({
				role: index % 2 === 0 ? 'user' : 'assistant',
				text: `message number ${String(index)}`,
			}))

			localStorage.setItem(key, JSON.stringify(log))
		},
		{ key: STORAGE_KEY, total: count },
	)
}

async function scroll_window_to_top(page: Page): Promise<void> {
	// Override the global smooth scroll so the test lands at the top deterministically, then let the
	// scroll listener update the button visibility.
	await page.evaluate(() => {
		window.scrollTo({ top: 0, behavior: 'instant' })
	})
}

async function scroll_window_to_middle(page: Page): Promise<void> {
	await page.evaluate(() => {
		const max_top = document.documentElement.scrollHeight - window.innerHeight

		window.scrollTo({ top: Math.round(max_top / 2), behavior: 'instant' })
	})
}

async function scroll_window_to_bottom(page: Page): Promise<void> {
	await page.evaluate(() => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
	})
}

// Emulate the software keyboard opening: shrink the layout viewport, then let the scroll settle.
async function open_keyboard(page: Page): Promise<void> {
	await page.setViewportSize({ width: DESKTOP_WIDTH, height: HEIGHT_WITH_KEYBOARD })
	await wait_for_scroll_settle(page)
}

async function open_long_conversation(page: Page): Promise<void> {
	await page.setViewportSize({ width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT })
	await page.goto('/chat')
	await seed_many_messages(page, LONG_MESSAGE_COUNT)
	await page.reload()
	await page.getByText(`message number ${String(LONG_MESSAGE_COUNT - 1)}`).waitFor({
		state: 'attached',
	})
	await wait_for_scroll_settle(page)
}

test('scrolls the whole page natively for a long conversation', async ({ page }) => {
	await page.setViewportSize({ width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT })
	await page.goto('/chat')
	await seed_many_messages(page, LONG_MESSAGE_COUNT)
	await page.reload()

	// Messages load client-side after hydration; wait for the last one before measuring the page height.
	await expect(page.getByText(`message number ${String(LONG_MESSAGE_COUNT - 1)}`)).toBeVisible()

	const is_page_scrollable = await page.evaluate(
		() => document.documentElement.scrollHeight > window.innerHeight,
	)

	expect(is_page_scrollable).toBe(true)
})

test('opens scrolled to the newest message on page display, not animating from the top', async ({
	page,
}) => {
	await page.setViewportSize({ width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT })
	await page.goto('/chat')
	await seed_many_messages(page, LONG_MESSAGE_COUNT)
	await page.reload()

	// Wait for the newest message to attach, then measure on the first frame — before any
	// smooth-scroll animation could carry the view down from the top.
	await page.getByText(`message number ${String(LONG_MESSAGE_COUNT - 1)}`).waitFor({
		state: 'attached',
	})

	expect(await distance_from_bottom(page)).toBeLessThanOrEqual(SCROLL_BOTTOM_TOLERANCE)
})

test('stays scrolled to the newest message when navigated into from another page', async ({
	page,
}) => {
	await page.setViewportSize({ width: MOBILE_WIDTH, height: MOBILE_HEIGHT })
	await page.goto('/chat')
	await seed_many_messages(page, LONG_MESSAGE_COUNT)
	// Full load so the message store picks up the seeded log, then land on another page.
	await page.goto('/')
	// The mobile chat link only navigates client-side once the header has hydrated.
	await page.waitForLoadState('networkidle')

	// Client-side navigation into /chat (not a reload); SvelteKit resets scroll to the top afterwards.
	await page.getByTestId(CHAT_TRIGGER_MOBILE).click()
	await page.waitForURL(/\/chat$/u)
	await page.getByText(`message number ${String(LONG_MESSAGE_COUNT - 1)}`).waitFor({
		state: 'attached',
	})

	// Measure only after SvelteKit's async scroll reset has run and settled — otherwise the view
	// looks correct on the first frame but drifts to the top a moment later.
	await wait_for_scroll_settle(page)

	expect(await distance_from_bottom(page)).toBeLessThanOrEqual(SCROLL_BOTTOM_TOLERANCE)
})

// The keyboard shrinks the viewport from the bottom; whatever the user was viewing must stay put rather
// than be hidden behind it. The invariant is the same from every scroll position — hold the distance
// from the bottom fixed: at the bottom that pins the newest message, mid-scroll and scrolled-up keep the
// viewed content in place instead of yanking to the bottom.
const KEYBOARD_SCROLL_CASES = [
	{ name: 'pinned to the bottom', scroll: scroll_window_to_bottom },
	{ name: 'at a mid-scroll position', scroll: scroll_window_to_middle },
	{ name: 'scrolled up to read history', scroll: scroll_window_to_top },
]

for (const scroll_case of KEYBOARD_SCROLL_CASES) {
	test(`keeps the viewed content in place when the keyboard opens ${scroll_case.name}`, async ({
		page,
	}) => {
		await open_long_conversation(page)
		await scroll_case.scroll(page)
		await wait_for_scroll_settle(page)

		const before = await distance_from_bottom(page)

		await open_keyboard(page)

		const after = await distance_from_bottom(page)

		expect(Math.abs(after - before)).toBeLessThanOrEqual(SCROLL_BOTTOM_TOLERANCE)
	})
}

test('shows the scroll-to-bottom button only when scrolled away from the bottom', async ({
	page,
}) => {
	await open_long_conversation(page)

	// The page opens at the newest message, so the button stays hidden.
	await expect(page.getByTestId(CHAT_SCROLL_BOTTOM)).toHaveCount(0)

	await scroll_window_to_top(page)

	const button = page.getByTestId(CHAT_SCROLL_BOTTOM)

	await expect(button).toBeVisible()
	await expect(button).toHaveAccessibleName(CHAT_LABELS.SCROLL_TO_BOTTOM)

	// Returning to the bottom hides it again.
	await scroll_window_to_bottom(page)

	await expect(button).toHaveCount(0)
})

test('scrolls to the bottom when the scroll-to-bottom button is clicked', async ({ page }) => {
	await open_long_conversation(page)
	await scroll_window_to_top(page)

	await page.getByTestId(CHAT_SCROLL_BOTTOM).click()
	await wait_for_scroll_settle(page)

	expect(await distance_from_bottom(page)).toBeLessThanOrEqual(SCROLL_BOTTOM_TOLERANCE)
	await expect(page.getByTestId(CHAT_SCROLL_BOTTOM)).toHaveCount(0)
})

// Scroll to the top, then read the button's opacity on the very next frame — all in-browser so
// Playwright round-trip latency can't push the sample past the short fade window.
async function opacity_on_scroll_to_top(page: Page): Promise<number> {
	return await page.evaluate(async () => {
		return await new Promise<number>((resolve) => {
			window.scrollTo({ top: 0, behavior: 'instant' })
			requestAnimationFrame(() => {
				const button = document.querySelector('[data-testid="chat-scroll-bottom"]')

				resolve(button ? Number(getComputedStyle(button).opacity) : 1)
			})
		})
	})
}

test('fades the scroll-to-bottom button in rather than popping it', async ({ page }) => {
	await open_long_conversation(page)

	// On the first frame after it mounts the button is still climbing from transparent; an instant
	// toggle would already read fully opaque.
	expect(await opacity_on_scroll_to_top(page)).toBeLessThan(1)

	// It settles fully opaque once the fade completes.
	await expect(page.getByTestId(CHAT_SCROLL_BOTTOM)).toHaveCSS('opacity', '1')
})

test('is a full-height app view: no site footer, and the viewport resizes for the keyboard', async ({
	page,
}) => {
	await page.goto('/chat')

	await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
		'content',
		/interactive-widget=resizes-content/u,
	)
	await expect(page.getByRole('heading', { name: FOOTER_HEADING })).toHaveCount(0)

	await page.goto('/')

	await expect(page.getByRole('heading', { name: FOOTER_HEADING })).toHaveCount(1)
})

test('pins the input to the bottom on desktop, like mobile', async ({ page }) => {
	await page.setViewportSize({ width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT })
	await page.goto('/chat')

	const bottom_gap = await page.evaluate(() => {
		const input = document.querySelector('[data-testid="chat-input"]')

		return input ? window.innerHeight - input.getBoundingClientRect().bottom : -1
	})

	expect(bottom_gap).toBeGreaterThanOrEqual(0)
	expect(bottom_gap).toBeLessThan(MAX_BOTTOM_GAP)
})
