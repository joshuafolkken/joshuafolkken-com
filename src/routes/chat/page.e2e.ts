import { expect, test, type Page } from '@playwright/test'
import { CHAT_LABELS } from '$lib/constants/chat'

const GREETING = 'Hello'
const CHAT_INPUT = 'chat-input'
const CHAT_SEND = 'chat-send'
const CHAT_MESSAGES = 'chat-messages'
const STORAGE_KEY = 'chat_log'
const PERSISTED_QUESTION = 'What did I ask before?'
const PERSISTED_ANSWER = 'This is the remembered answer.'
const MARKDOWN_ANSWER = 'use `queue` and **kit**, see [docs](https://example.com)'
const FOOTER_HEADING = 'Top Supporters'
const CHAT_EMPTY = 'chat-empty'
const DESKTOP_WIDTH = 1280
const DESKTOP_HEIGHT = 800
// The input sits ~1rem above the bottom (same as mobile); guard against a large floating gap.
const MAX_BOTTOM_GAP = 48
const LONG_MESSAGE_COUNT = 40

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
