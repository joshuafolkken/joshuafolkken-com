import { expect, test, type Page } from '@playwright/test'
import { CHAT_LABELS } from '$lib/constants/chat'

const GREETING = 'Hello'
const CHAT_INPUT = 'chat-input'
const CHAT_SEND = 'chat-send'
const CHAT_MESSAGES = 'chat-messages'
const CHAT_MESSAGE_USER = 'chat-message-user'
const CHAT_MESSAGE_ASSISTANT = 'chat-message-assistant'
const CHAT_TRIGGER_MOBILE = 'chat-trigger-mobile'
const STORAGE_KEY = 'chat_log'
const PERSISTED_QUESTION = 'What did I ask before?'
const PERSISTED_ANSWER = 'This is the remembered answer.'
const MARKDOWN_ANSWER = 'use `queue` and **kit**, see [docs](https://example.com)'
const FOOTER_HEADING = 'Top Supporters'
const CHAT_EMPTY = 'chat-empty'
const DESKTOP_WIDTH = 1280
const DESKTOP_HEIGHT = 800
// Below the 62rem desktop breakpoint the header exposes the mobile chat link used for in-app navigation.
const MOBILE_WIDTH = 390
const MOBILE_HEIGHT = 800
// The input sits ~1rem above the bottom (same as mobile); guard against a large floating gap.
const MAX_BOTTOM_GAP = 48
const LONG_MESSAGE_COUNT = 40
// On page display the view must already sit at the bottom; allow only sub-pixel rounding slack.
const SCROLL_BOTTOM_TOLERANCE = 8
// After a client-side navigation SvelteKit resets scroll asynchronously, animating under
// `scroll-behavior: smooth`; wait until the position holds still before asserting where it landed.
const SCROLL_SETTLE_MS = 300
// A full-width AI reply may fall a hair short of the column width only from sub-pixel rounding.
const FULL_WIDTH_TOLERANCE = 2

async function seed_conversation(page: Page): Promise<void> {
	await page.evaluate(
		({ key, question, answer }) => {
			const log = [
				{ role: 'user', text: question },
				{ role: 'assistant', text: answer },
			]

			localStorage.setItem(key, JSON.stringify(log))
		},
		{ key: STORAGE_KEY, question: PERSISTED_QUESTION, answer: PERSISTED_ANSWER },
	)
}

async function seed_markdown_answer(page: Page): Promise<void> {
	await page.evaluate(
		({ key, answer }) => {
			const log = [
				{ role: 'user', text: 'q' },
				{ role: 'assistant', text: answer },
			]

			localStorage.setItem(key, JSON.stringify(log))
		},
		{ key: STORAGE_KEY, answer: MARKDOWN_ANSWER },
	)
}

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

test('chat page shows the input and send button', async ({ page }) => {
	await page.goto('/chat')

	await expect(page.getByTestId(CHAT_INPUT)).toBeVisible()
	await expect(page.getByTestId(CHAT_SEND)).toBeVisible()
	await expect(page.getByTestId(CHAT_INPUT)).toBeFocused()

	await page.getByTestId(CHAT_INPUT).fill(GREETING)

	await expect(page.getByTestId(CHAT_INPUT)).toHaveValue(GREETING)
})

test('shows the empty-state greeting only when there is no conversation', async ({ page }) => {
	await page.goto('/chat')

	await expect(page.getByTestId(CHAT_EMPTY)).toHaveText(CHAT_LABELS.EMPTY_GREETING)

	await seed_conversation(page)
	await page.reload()

	await expect(page.getByTestId(CHAT_EMPTY)).toHaveCount(0)
})

test('renders the send control as an icon only, labelled for assistive tech', async ({ page }) => {
	await page.goto('/chat')

	const send = page.getByTestId(CHAT_SEND)

	await expect(send).toBeVisible()
	await expect(send).not.toContainText(CHAT_LABELS.SEND)
	await expect(send.locator('svg')).toBeVisible()
	await expect(page.getByRole('button', { name: CHAT_LABELS.SEND })).toBeVisible()
})

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

test('does not render the page title or description block', async ({ page }) => {
	await page.goto('/chat')

	await expect(page.getByRole('heading', { name: CHAT_LABELS.TITLE })).toHaveCount(0)
	await expect(page.getByText(CHAT_LABELS.DESCRIPTION)).toHaveCount(0)
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

test('restores a persisted conversation from localStorage after reload', async ({ page }) => {
	await page.goto('/chat')
	await seed_conversation(page)
	await page.reload()

	await expect(page.getByText(PERSISTED_QUESTION)).toBeVisible()
	await expect(page.getByText(PERSISTED_ANSWER)).toBeVisible()
})

test('renders assistant markdown as formatted html, not raw syntax', async ({ page }) => {
	await page.goto('/chat')
	await seed_markdown_answer(page)
	await page.reload()

	const messages = page.getByTestId(CHAT_MESSAGES)

	await expect(messages.locator('code', { hasText: 'queue' })).toBeVisible()
	await expect(messages.locator('strong', { hasText: 'kit' })).toBeVisible()
	await expect(messages.getByRole('link', { name: 'docs' })).toHaveAttribute(
		'href',
		/example\.com/u,
	)

	expect(await messages.innerText()).not.toContain('`')
})

const EMPTY_BOX = { x: 0, y: 0, width: 0, height: 0 }

async function box_of(page: Page, testid: string): Promise<{ x: number; width: number }> {
	return (await page.getByTestId(testid).boundingBox()) ?? EMPTY_BOX
}

async function message_layout(page: Page): Promise<{
	container: { x: number; width: number }
	user: { x: number; width: number }
	assistant: { x: number; width: number }
}> {
	return {
		container: await box_of(page, CHAT_MESSAGES),
		user: await box_of(page, CHAT_MESSAGE_USER),
		assistant: await box_of(page, CHAT_MESSAGE_ASSISTANT),
	}
}

test('renders AI replies full width and user messages as constrained bubbles', async ({ page }) => {
	await page.setViewportSize({ width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT })
	await page.goto('/chat')
	await seed_conversation(page)
	await page.reload()

	await expect(page.getByTestId(CHAT_MESSAGE_USER)).toBeVisible()
	await expect(page.getByTestId(CHAT_MESSAGE_ASSISTANT)).toBeVisible()

	const { container, user, assistant } = await message_layout(page)

	// The AI reply spans the full width of the conversation column, with no bubble to constrain it.
	expect(assistant.width).toBeGreaterThanOrEqual(container.width - FULL_WIDTH_TOLERANCE)

	// The user message stays a constrained bubble: narrower than the column and offset from the left.
	expect(user.width).toBeLessThan(container.width)
	expect(user.x).toBeGreaterThan(container.x)
})

test('clears the conversation when /clear is submitted', async ({ page }) => {
	await page.goto('/chat')
	await seed_conversation(page)
	await page.reload()

	await expect(page.getByText(PERSISTED_QUESTION)).toBeVisible()

	await page.getByTestId(CHAT_INPUT).fill('/clear')
	await page.getByTestId(CHAT_SEND).click()

	await expect(page.getByText(PERSISTED_QUESTION)).toHaveCount(0)

	const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)

	expect(stored).toBe('[]')
})
