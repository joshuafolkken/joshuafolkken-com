import { security_headers_e2e } from '@joshuafolkken/app-kit/security/e2e'
import { expect, test } from '@playwright/test'
import { TEST_IDS } from '$lib/test-ids'
import { TEST_ROUTES } from '$lib/test-routes'

declare global {
	/** Populated by the nonce-tagged Consent Mode bootstrap in `src/app.html`. */
	// eslint-disable-next-line @typescript-eslint/naming-convention -- Google-owned global name
	var dataLayer: Array<unknown> | undefined
}

// Ad slots keep polling, so the post carrying AdSense may never reach `networkidle`; the bounded
// settle window app-kit ships plus this ceiling keep the run finite.
const VIOLATION_TEST_TIMEOUT_MS = 45_000

// The INSTANCE-specific half of the CSP coverage. The stack-universal half lives in
// `security-headers.e2e.ts`, seeded from `@joshuafolkken/app-kit/security/e2e`, so nothing here
// restates a directive rule — every check below calls the shared helpers.
//
// Why a site-level CSP check exists here at all, given the seeded spec already asserts one: that
// spec skips unless the run targets the preview server, because its baseline half reads headers
// `_headers` only supplies through the Worker runtime. Playwright runs against the vite dev server
// locally, so adopting the seeded spec alone would leave `pnpm josh test` with NO CSP coverage
// until CI. The policy comes from `kit.csp` in `svelte.config.js`, not from `_headers`, so it IS
// served in dev — and this check runs in both environments.
test.describe('Content Security Policy', () => {
	test('serves the nonce-based policy in every environment', async ({ page }) => {
		const response = await page.goto(TEST_ROUTES.HOME)

		expect(security_headers_e2e.csp_problems(response)).toStrictEqual([])
	})

	test('the nonce-tagged Consent Mode bootstrap still executes', async ({ page }) => {
		await page.goto(TEST_ROUTES.HOME, { waitUntil: 'domcontentloaded' })

		// dataLayer is only populated by the inline bootstrap in app.html, so a non-empty array
		// proves the browser accepted the nonce instead of blocking the script.
		const consent_entries = await page.evaluate(() => globalThis.dataLayer?.length ?? 0)

		expect(consent_entries).toBeGreaterThan(0)
	})

	// Kept rather than delegated to the seeded spec, which watches the home page too but only against
	// the preview server: on the local dev run that check does not execute, so removing this one
	// would drop home-page violation coverage that exists today. The post below is not a substitute —
	// it renders neither the hero, the project cards nor the skills section.
	test('reports no violations on the home page', async ({ page }) => {
		test.setTimeout(VIOLATION_TEST_TIMEOUT_MS)

		const violations = await security_headers_e2e.watch_violations(page)

		await page.goto(TEST_ROUTES.HOME, { waitUntil: 'load' })
		await security_headers_e2e.settle(page)

		expect(violations).toStrictEqual([])
	})

	test('reports no violations on the post carrying the YouTube embed and AdSense', async ({
		page,
	}) => {
		test.setTimeout(VIOLATION_TEST_TIMEOUT_MS)

		const violations = await security_headers_e2e.watch_violations(page)

		await page.goto(TEST_ROUTES.BLOG_YOUTUBE_POST, { waitUntil: 'load' })

		// Self-validating: the embed is the reason this route is tested (it is what exercises
		// frame-src), and it is loading="lazy" — so without forcing it into view a content edit that
		// dropped the video would leave this test green on a page that never loaded a frame at all.
		// The talk layout renders two players, one per breakpoint, so select the one this viewport
		// actually shows; strict mode still reports it if the layout ever shows both.
		const embed = page.getByTestId(TEST_IDS.YOUTUBE_EMBED).filter({ visible: true })

		await expect(embed).toBeVisible()
		await embed.scrollIntoViewIfNeeded()
		await security_headers_e2e.settle(page)

		expect(violations).toStrictEqual([])
	})
})
