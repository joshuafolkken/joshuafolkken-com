import { expect, test, type Page } from '@playwright/test'
import { CHAT_LABELS } from '$lib/constants/chat'

const GREETING = 'Hello'
const CHAT_INPUT = 'chat-input'
const CHAT_SEND = 'chat-send'
const CHAT_MESSAGES = 'chat-messages'
const CHAT_MESSAGE_USER = 'chat-message-user'
const CHAT_MESSAGE_ASSISTANT = 'chat-message-assistant'
const STORAGE_KEY = 'chat_log'
const PERSISTED_QUESTION = 'What did I ask before?'
const PERSISTED_ANSWER = 'This is the remembered answer.'
const MARKDOWN_ANSWER = 'use `queue` and **kit**, see [docs](https://example.com)'
const STREAMED_MARKDOWN = 'use `queue` and **kit**'
const CHAT_ENDPOINT = '**/api/chat'
const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream'
const CHAT_EMPTY = 'chat-empty'
const DESKTOP_WIDTH = 1280
const DESKTOP_HEIGHT = 800
// A full-width AI reply may fall a hair short of the column width only from sub-pixel rounding.
const FULL_WIDTH_TOLERANCE = 2

async function mock_chat_stream(page: Page, content: string): Promise<void> {
	await page.route(CHAT_ENDPOINT, async (route) => {
		const delta = JSON.stringify({ choices: [{ delta: { content } }] })

		await route.fulfill({
			status: 200,
			headers: { 'content-type': EVENT_STREAM_CONTENT_TYPE },
			body: `data: ${delta}\n\ndata: [DONE]\n\n`,
		})
	})
}

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

test('does not render the page title or description block', async ({ page }) => {
	await page.goto('/chat')

	await expect(page.getByRole('heading', { name: CHAT_LABELS.TITLE })).toHaveCount(0)
	await expect(page.getByText(CHAT_LABELS.DESCRIPTION)).toHaveCount(0)
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

test('renders a streamed reply as formatted markdown once the stream completes', async ({
	page,
}) => {
	await mock_chat_stream(page, STREAMED_MARKDOWN)
	await page.goto('/chat')

	await page.getByTestId(CHAT_INPUT).fill('hello')
	await page.getByTestId(CHAT_SEND).click()

	const messages = page.getByTestId(CHAT_MESSAGES)

	// After the stream completes the raw Markdown is parsed: inline code and bold become real elements.
	await expect(messages.locator('code', { hasText: 'queue' })).toBeVisible()
	await expect(messages.locator('strong', { hasText: 'kit' })).toBeVisible()

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
