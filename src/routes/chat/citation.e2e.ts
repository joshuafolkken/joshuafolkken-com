import { expect, test, type Page } from '@playwright/test'

const CHAT_MESSAGES = 'chat-messages'
const STORAGE_KEY = 'chat_log'
// The RAG model cites a document by its flattened index key wrapped in a relative link; the renderer must
// rewrite it into a real GitHub URL with clean display text instead of a broken same-origin link.
const CITATION_KEY = 'github__kit__docs__package.md'
const CITATION_ANSWER = `See [${CITATION_KEY}](${CITATION_KEY}) for the details.`
const CITATION_BLOB_URL = 'https://github.com/joshuafolkken/kit/blob/main/docs/package.md'
const CITATION_DISPLAY = 'docs/package.md — kit'
// The other half of the defect: an accurate absolute Source URL labelled with the flattened key.
const LABELLED_KEY = 'github__joshuafolkken__README.md'
const LABELLED_URL = 'https://github.com/joshuafolkken/joshuafolkken/blob/main/README.md'
const LABELLED_ANSWER = `Reference: [${LABELLED_KEY} — joshuafolkken](${LABELLED_URL})`
const LABELLED_DISPLAY = 'README.md — joshuafolkken'

// Seed a stored assistant answer so the reply renders through the real {@html markdown.to_html(...)} path
// on reload — no chat backend required to exercise the rendered output.
async function seed_answer(page: Page, answer: string): Promise<void> {
	await page.evaluate(
		({ key, text }) => {
			const log = [
				{ role: 'user', text: 'q' },
				{ role: 'assistant', text },
			]

			localStorage.setItem(key, JSON.stringify(log))
		},
		{ key: STORAGE_KEY, text: answer },
	)
}

test('rewrites a flattened github__ citation into a real GitHub link', async ({ page }) => {
	await page.goto('/chat')
	await seed_answer(page, CITATION_ANSWER)
	await page.reload()

	const messages = page.getByTestId(CHAT_MESSAGES)
	const link = messages.getByRole('link', { name: CITATION_DISPLAY })

	// The flattened key becomes an absolute GitHub blob URL that opens safely in a new tab.
	await expect(link).toHaveAttribute('href', CITATION_BLOB_URL)
	await expect(link).toHaveAttribute('target', '_blank')

	// The broken relative key and its doubled-underscore display must not survive into the output.
	expect(await messages.innerText()).not.toContain(CITATION_KEY)
})

test('cleans a flattened key out of a citation label while keeping its source URL', async ({
	page,
}) => {
	await page.goto('/chat')
	await seed_answer(page, LABELLED_ANSWER)
	await page.reload()

	const messages = page.getByTestId(CHAT_MESSAGES)
	const link = messages.getByRole('link', { name: LABELLED_DISPLAY })

	// The accurate Source URL the model cited is preserved; only the leaked key is cleaned out.
	await expect(link).toHaveAttribute('href', LABELLED_URL)
	expect(await messages.innerText()).not.toContain(LABELLED_KEY)
})
