import { expect, test, type Page } from '@playwright/test'
import { CHAT_LABELS } from '$lib/constants/chat'
import { test_hydration } from '$lib/test-hydration'

const CHAT_INPUT = 'chat-input'
const CHAT_SEND = 'chat-send'
const CHAT_MESSAGE_ASSISTANT = 'chat-message-assistant'
const CHAT_MESSAGE_ERROR_DETAIL = 'chat-message-error-detail'
const CHAT_ENDPOINT = '**/api/chat'
const JSON_CONTENT_TYPE = 'application/json'
const SERVER_ERROR_STATUS = 500
const SERVER_ERROR_DETAIL = 'ai search down'

async function mock_chat_error(page: Page): Promise<void> {
	await page.route(CHAT_ENDPOINT, async (route) => {
		await route.fulfill({
			status: SERVER_ERROR_STATUS,
			headers: { 'content-type': JSON_CONTENT_TYPE },
			body: JSON.stringify({ error: SERVER_ERROR_DETAIL }),
		})
	})
}

async function send_question(page: Page, question: string): Promise<void> {
	await page.getByTestId(CHAT_INPUT).fill(question)
	await page.getByTestId(CHAT_SEND).click()
}

test('shows a friendly error headline with the code and detail as a sub-message', async ({
	page,
}) => {
	await mock_chat_error(page)
	await test_hydration.goto_hydrated(page, '/chat')

	await send_question(page, 'hello')

	const assistant = page.getByTestId(CHAT_MESSAGE_ASSISTANT).last()

	// The reader sees a reassuring headline, not the raw failure.
	await expect(assistant).toContainText(CHAT_LABELS.ERROR)

	// The technical detail (HTTP status + server message) rides along as a muted sub-message.
	const detail = assistant.getByTestId(CHAT_MESSAGE_ERROR_DETAIL)

	await expect(detail).toContainText(String(SERVER_ERROR_STATUS))
	await expect(detail).toContainText(SERVER_ERROR_DETAIL)
})
