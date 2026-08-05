import { expect, test, type Page } from '@playwright/test'
import { test_hydration } from '$lib/test-hydration'

// Pin the browser time zone so the rendered wall-clock string is deterministic across machines/CI.
test.use({ timezoneId: 'UTC' })

const STORAGE_KEY = 'chat_log'
const CHAT_MESSAGE_TIME = 'chat-message-time'
const CHAT_MESSAGE_ASSISTANT = 'chat-message-assistant'
const ANSWER_ISO = '2026-07-08T13:45:00.000Z'
const ANSWER_TEXT = 'The remembered answer.'
const EXPECTED_STAMP = '2026-07-08 13:45'

async function seed_log(page: Page, log: Array<Record<string, string>>): Promise<void> {
	await page.evaluate(
		({ key, value }) => {
			localStorage.setItem(key, JSON.stringify(value))
		},
		{ key: STORAGE_KEY, value: log },
	)
}

test('renders the capture time at the end of an AI reply', async ({ page }) => {
	await test_hydration.goto_hydrated(page, '/chat')
	await seed_log(page, [
		{ role: 'user', text: 'q' },
		{ role: 'assistant', text: ANSWER_TEXT, timestamp: ANSWER_ISO },
	])
	await test_hydration.reload_hydrated(page)

	const stamp = page.getByTestId(CHAT_MESSAGE_TIME)

	await expect(stamp).toBeVisible()
	await expect(stamp).toContainText(EXPECTED_STAMP)
	await expect(stamp).toHaveAttribute('datetime', ANSWER_ISO)
})

test('shows the timestamp only on the AI reply, not the user question', async ({ page }) => {
	await test_hydration.goto_hydrated(page, '/chat')
	await seed_log(page, [
		{ role: 'user', text: 'q' },
		{ role: 'assistant', text: ANSWER_TEXT, timestamp: ANSWER_ISO },
	])
	await test_hydration.reload_hydrated(page)

	// One exchange → exactly one timestamp, and it sits inside the assistant bubble.
	await expect(page.getByTestId(CHAT_MESSAGE_TIME)).toHaveCount(1)
	await expect(page.getByTestId(CHAT_MESSAGE_ASSISTANT).getByTestId(CHAT_MESSAGE_TIME)).toHaveCount(
		1,
	)
})

test('renders no timestamp for a legacy reply that has none', async ({ page }) => {
	await test_hydration.goto_hydrated(page, '/chat')
	await seed_log(page, [
		{ role: 'user', text: 'q' },
		{ role: 'assistant', text: ANSWER_TEXT },
	])
	await test_hydration.reload_hydrated(page)

	await expect(page.getByTestId(CHAT_MESSAGE_ASSISTANT)).toBeVisible()
	await expect(page.getByTestId(CHAT_MESSAGE_TIME)).toHaveCount(0)
})
