import type { Page } from '@playwright/test'

// Set by the root layout's onMount (#807) — the earliest moment one-shot interactions are safe.
const HYDRATED_SELECTOR = 'main[data-hydrated="true"]'

// Explicit, above the 10s action timeout: at suite start the dev server transforms hundreds of
// modules for five workers at once and hydration can exceed 10s, which is startup latency, not
// an app failure. Bounded below the 30s test timeout so a genuinely broken marker still fails
// inside the test's own budget with this selector named in the error.
const HYDRATION_TIMEOUT_MS = 20_000

// Navigate and wait until the client app has attached its event handlers, so one-shot clicks
// and key presses cannot be dispatched into the pre-hydration gap and silently lost.
//
// Why this exists (#807): Playwright's actionability checks (visible, stable, enabled) are all
// satisfied by the SSR markup alone, before hydration wires any handler. On the vite dev server
// that gap was measured at 50–151ms solo and 1.6s+ under parallel-worker contention — wide
// enough to lose a click that a later, identical click delivers. The preview server ships one
// prebuilt bundle, which is why the same tests never failed in CI. Use this instead of a bare
// `page.goto` in any spec whose first assertion depends on an interaction.
async function goto_hydrated(page: Page, route: string): Promise<void> {
	await page.goto(route)
	await page
		.locator(HYDRATED_SELECTOR)
		.waitFor({ state: 'attached', timeout: HYDRATION_TIMEOUT_MS })
}

// `page.reload()` re-enters the same gap — the fresh document starts un-hydrated all over
// again, so a spec that reloads (e.g. to pick up seeded localStorage) must wait again before
// its next interaction.
async function reload_hydrated(page: Page): Promise<void> {
	await page.reload()
	await page
		.locator(HYDRATED_SELECTOR)
		.waitFor({ state: 'attached', timeout: HYDRATION_TIMEOUT_MS })
}

const test_hydration = { HYDRATED_SELECTOR, goto_hydrated, reload_hydrated }

export { test_hydration }
