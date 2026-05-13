import { expect, test } from '@playwright/test'

test.describe('Consent Mode v2', () => {
	test('_ga cookie is absent before consent is given', async ({ page, context }) => {
		await page.goto('/')
		await page.waitForLoadState('networkidle')

		const cookies = await context.cookies()
		const ga_cookie = cookies.find((cookie) => cookie.name === '_ga')

		expect(ga_cookie).toBeUndefined()
	})
})
