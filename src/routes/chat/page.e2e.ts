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
// A tail chunk held back until the test releases it, so a still-streaming frame is observable first.
// A real word absent from the first chunk, so it is unambiguous whether the tail has arrived yet.
const STREAM_TAIL = 'Afterward'
// Window flag the test sets to release the held-back tail chunk (see install_streaming_fetch).
const STREAM_RELEASE_FLAG = '__release_chat_stream'
const CHAT_ENDPOINT = '**/api/chat'
const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream'
const FOLLOW_UP = 'Tell me more about that.'
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

interface StreamingFetchConfig {
	chunks: Array<string>
	endpoint: string
	content_type: string
	release_flag: string
}

// Runs in the browser (serialized by addInitScript). Replaces fetch for the chat endpoint with a real
// ReadableStream that emits the first chunk, then holds the rest until the test sets globalThis[release_flag].
// Gating on an explicit flag (not a timer) makes the still-streaming frame observable deterministically —
// route.fulfill cannot pause mid-body, hence the fetch stub.
function install_streaming_fetch(config: StreamingFetchConfig): void {
	const { chunks, endpoint, content_type, release_flag } = config
	const POLL_MS = 25
	const encoder = new TextEncoder()
	const original_fetch = fetch.bind(globalThis)

	function encode_delta(content: string): Uint8Array {
		return encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`)
	}

	async function wait_for_release(): Promise<void> {
		await new Promise<void>((resolve) => {
			function poll(): void {
				if (Reflect.get(globalThis, release_flag)) resolve()
				else setTimeout(poll, POLL_MS)
			}

			poll()
		})
	}

	// eslint-disable-next-line unicorn/no-global-object-property-assignment -- test stub must replace fetch
	globalThis.fetch = async (input, init) => {
		// The client posts to the exact string '/api/chat'; matching only that string never constructs a
		// Request or reads a body, so no other fetch on the page is disturbed.
		if (typeof input !== 'string' || input !== endpoint) return await original_fetch(input, init)

		const body = new ReadableStream({
			async start(controller) {
				const [head, ...tail] = chunks

				controller.enqueue(encode_delta(head ?? ''))
				await wait_for_release()

				for (const chunk of tail) controller.enqueue(encode_delta(chunk))

				controller.enqueue(encoder.encode('data: [DONE]\n\n'))
				controller.close()
			},
		})

		return new Response(body, { status: 200, headers: { 'content-type': content_type } })
	}
}

async function mock_streaming_chat(
	page: Page,
	stream_chunks: Array<string>,
	release_flag: string,
): Promise<void> {
	await page.addInitScript(install_streaming_fetch, {
		chunks: stream_chunks,
		endpoint: '/api/chat',
		content_type: EVENT_STREAM_CONTENT_TYPE,
		release_flag,
	})
}

async function send_question(page: Page, question: string): Promise<void> {
	await page.getByTestId(CHAT_INPUT).fill(question)
	await page.getByTestId(CHAT_SEND).click()
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

test('sends the recent conversation history with a follow-up question', async ({ page }) => {
	let captured_body: unknown = undefined

	await page.route(CHAT_ENDPOINT, async (route) => {
		captured_body = route.request().postDataJSON()

		const delta = JSON.stringify({ choices: [{ delta: { content: 'ok' } }] })

		await route.fulfill({
			status: 200,
			headers: { 'content-type': EVENT_STREAM_CONTENT_TYPE },
			body: `data: ${delta}\n\ndata: [DONE]\n\n`,
		})
	})

	await page.goto('/chat')
	await seed_conversation(page)
	await page.reload()

	await page.getByTestId(CHAT_INPUT).fill(FOLLOW_UP)
	await page.getByTestId(CHAT_SEND).click()

	await expect(page.getByTestId(CHAT_MESSAGE_ASSISTANT).last()).toContainText('ok')

	// The follow-up resolves against prior turns because the request now carries the earlier
	// question and answer, not just the latest message.
	expect(captured_body).toEqual({
		messages: [
			{ role: 'user', content: PERSISTED_QUESTION },
			{ role: 'assistant', content: PERSISTED_ANSWER },
			{ role: 'user', content: FOLLOW_UP },
		],
	})
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

test('formats the reply live while it is still streaming', async ({ page }) => {
	// First chunk carries bold markup; the tail chunk is held back until the test releases it.
	await mock_streaming_chat(page, [STREAMED_MARKDOWN, ` ${STREAM_TAIL}`], STREAM_RELEASE_FLAG)
	await page.goto('/chat')
	await send_question(page, 'hello')

	const messages = page.getByTestId(CHAT_MESSAGES)

	// The first chunk's bold renders as a real element while the reply is still streaming. The tail is
	// gated, so its absence here is deterministic — the old raw-text-while-streaming render only formatted
	// after completion, when the tail would already be present, so this assertion would fail against it.
	await expect(messages.locator('strong', { hasText: 'kit' })).toBeVisible()
	await expect(messages).not.toContainText(STREAM_TAIL)

	// Release the held-back tail; the stream then completes with the full, still-formatted text intact.
	await page.evaluate((flag) => Reflect.set(globalThis, flag, true), STREAM_RELEASE_FLAG)

	await expect(messages).toContainText(STREAM_TAIL)
	await expect(messages.locator('strong', { hasText: 'kit' })).toBeVisible()
	expect(await messages.innerText()).not.toContain('**')
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
