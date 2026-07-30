import { expect, test, type Page } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'

declare global {
	/** Populated by the nonce-tagged Consent Mode bootstrap in `src/app.html`. */
	// eslint-disable-next-line @typescript-eslint/naming-convention -- Google-owned global name
	var dataLayer: Array<unknown> | undefined
	/** Bridge installed by `watch_violations` below; test-only. */
	var report_csp_violation: (detail: string) => void
}

const CSP_HEADER = 'content-security-policy'
// Ad slots keep polling, so a page carrying AdSense may never reach `networkidle`. Bound the
// settle window and assert on whatever the browser has reported by then.
const SETTLE_TIMEOUT_MS = 8000
const VIOLATION_TEST_TIMEOUT_MS = 45_000
const SCRIPT_SRC_PATTERN = /script-src ([^;]*)/u
const STYLE_SRC_PATTERN = /style-src ([^;]*)/u
const UNSAFE_INLINE = "'unsafe-inline'"

async function get_csp(page: Page, route: string): Promise<string> {
	const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
	const header = response?.headers()[CSP_HEADER]

	expect(header, `no ${CSP_HEADER} header on ${route}`).toBeTruthy()

	return header ?? ''
}

function match_directive(csp: string, pattern: RegExp): string {
	const directive = pattern.exec(csp)?.[1]

	expect(directive, `directive ${pattern.source} missing from: ${csp}`).toBeDefined()

	return directive ?? ''
}

/** Give the page a bounded window to finish loading; ad polling may never reach idle. */
async function settle(page: Page): Promise<void> {
	try {
		await page.waitForLoadState('networkidle', { timeout: SETTLE_TIMEOUT_MS })
	} catch {
		// Still busy after the window — assert on what has been reported so far.
	}
}

/** Collect the CSP violations the browser reports while the page runs. */
async function watch_violations(page: Page): Promise<Array<string>> {
	const violations: Array<string> = []

	await page.exposeFunction('report_csp_violation', (detail: string) => {
		violations.push(detail)
	})

	await page.addInitScript(() => {
		document.addEventListener('securitypolicyviolation', (event) => {
			globalThis.report_csp_violation(
				`${event.violatedDirective}: ${event.blockedURI} (${event.sourceFile || 'inline'})`,
			)
		})
	})

	return violations
}

test.describe('Content Security Policy', () => {
	test('script-src is nonce-based, not unsafe-inline', async ({ page }) => {
		const csp = await get_csp(page, TEST_ROUTES.HOME)
		const script_source = match_directive(csp, SCRIPT_SRC_PATTERN)

		expect(script_source).toContain("'nonce-")
		expect(script_source).not.toContain(UNSAFE_INLINE)
	})

	test("style-src keeps 'unsafe-inline' for Svelte transitions", async ({ page }) => {
		const csp = await get_csp(page, TEST_ROUTES.HOME)

		expect(match_directive(csp, STYLE_SRC_PATTERN)).toContain(UNSAFE_INLINE)
	})

	test('the nonce-tagged Consent Mode bootstrap still executes', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME, { waitUntil: 'domcontentloaded' })

		// dataLayer is only populated by the inline bootstrap in app.html, so a non-empty array
		// proves the browser accepted the nonce instead of blocking the script.
		const consent_entries = await page.evaluate(() => globalThis.dataLayer?.length ?? 0)

		expect(consent_entries).toBeGreaterThan(0)
	})

	const VIOLATION_ROUTES = [
		['home', TEST_ROUTES.HOME],
		['blog post (YouTube embed, AdSense)', TEST_ROUTES.BLOG_YOUTUBE_POST],
	] as const

	for (const [name, route] of VIOLATION_ROUTES) {
		test(`reports no violations on the ${name}`, async ({ page }) => {
			test.setTimeout(VIOLATION_TEST_TIMEOUT_MS)

			const violations = await watch_violations(page)

			await page.goto(route, { waitUntil: 'load' })
			await settle(page)

			expect(violations).toStrictEqual([])
		})
	}
})
