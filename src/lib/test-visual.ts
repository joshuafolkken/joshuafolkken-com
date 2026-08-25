import { expect, type Locator, type Page } from '@playwright/test'
import { test_hydration } from '$lib/test-hydration'

interface Viewport {
	width: number
	height: number
}

// Structural match for the option bag `expect(page).toHaveScreenshot()` accepts. Declared here
// rather than imported: Playwright does not export the assertion's option type, and the literal
// unions ('disabled', 'hide', 'css') have to survive into the call site or they widen to `string`
// and stop type-checking against Playwright's own signature.
interface VisualOptions {
	fullPage: boolean
	animations: 'disabled'
	caret: 'hide'
	scale: 'css'
	maxDiffPixelRatio: number
	timeout: number
	mask: Array<Locator>
}

// Fixed viewports, because the baseline is a pixel grid: anything derived from the runner's own
// window size would produce a different image on the next machine. 1280x800 is the narrowest
// desktop width at which every `lg:` grid on this site is still in its multi-column form, and
// 390x844 is the iPhone-class width where the same grids collapse to one column.
const DESKTOP_VIEWPORT: Viewport = { width: 1280, height: 800 }
const MOBILE_VIEWPORT: Viewport = { width: 390, height: 844 }

// One set of baselines is committed, for exactly the environment `ci.yml` normally runs the suite
// in: x86_64 linux inside the Playwright container image. A second set would not be a copy of the
// first — text rasterization differs across operating systems and architectures alike, so it would
// be a second definition of "correct", needing its own regeneration on every intentional UI change
// and free to drift from the one CI enforces.
//
// All three conditions are load-bearing. The architecture is checked as well as the OS because an
// arm64 linux machine reaches the same `-linux` snapshot names. The container is checked because
// `ci.yml` falls back to a bare runner whenever the image for a freshly bumped Playwright version
// is not yet published on MCR — a real event, since `josh latest` bumps that pin — and a bare
// runner brings its own system fonts, which decide every glyph these pages fall back to. Comparing
// there would fail the whole file for the runner it was photographed on rather than for a change
// anyone made. See the header comment of `src/routes/visual-regression.e2e.ts` for how to
// regenerate.
const BASELINE_ARCHITECTURE = 'x64'
const PLAYWRIGHT_IMAGE_BROWSERS_PATH = '/ms-playwright'
const is_baseline_platform =
	process.platform === 'linux' &&
	process.arch === BASELINE_ARCHITECTURE &&
	process.env['PLAYWRIGHT_BROWSERS_PATH'] === PLAYWRIGHT_IMAGE_BROWSERS_PATH
const NON_BASELINE_SKIP_REASON =
	'Visual baselines are committed for x86_64 linux inside the Playwright container only (what CI normally runs). See visual-regression.e2e.ts for how to regenerate them.'

// Aborted so the pages render the same way whether or not the run can reach Google and YouTube.
// Google Fonts is deliberately absent: this site loads its two webfonts from fonts.googleapis.com,
// and blocking them would swap every glyph on the page for a system fallback — the one third-party
// dependency the baseline genuinely has.
const THIRD_PARTY_URL_PATTERNS: ReadonlyArray<string> = [
	'https://*.googlesyndication.com/**',
	'https://*.doubleclick.net/**',
	'https://*.adtrafficquality.google/**',
	'https://www.googletagmanager.com/**',
	'https://*.google-analytics.com/**',
	'https://*.youtube.com/**',
	'https://*.youtube-nocookie.com/**',
	'https://i.ytimg.com/**',
]

// `app.html` ships the webfont stylesheet as media="print" and swaps it to "all" once it has
// loaded, so a screenshot taken before the swap is rendered entirely in the system fallback.
// Waiting on the attribute is what makes the two runs comparable.
const FONT_LINK_SELECTOR = 'link[data-font-css]'

const SETTLE_TIMEOUT_MS = 20_000
const SCREENSHOT_TIMEOUT_MS = 20_000

// Headroom for antialiasing noise, not for layout drift. Baselines are produced in the same
// container image CI normally uses, where the observed diff is zero; the margin exists for the
// fallback path in `ci.yml`, which runs the suite on a bare runner whenever the Playwright image
// for a freshly bumped version is not yet on MCR. Keep it small enough that a shifted element
// still fails: at 1280px wide, 0.5% is roughly a 40px-tall band of the page.
const MAX_DIFF_PIXEL_RATIO = 0.005

// A `fullPage` screenshot does not scroll the page — Chromium captures beyond the viewport
// instead — so every IntersectionObserver below the fold stays unfired and its content would be
// photographed in its hidden state. These rules put that content where a real reader sees it.
// `!important` is what lets a stylesheet win against the inline styles Svelte writes.
const DETERMINISTIC_CSS = `
	.reveal-on-scroll,
	.reveal-on-scroll.revealed {
		opacity: 1 !important;
		transform: none !important;
		transition: none !important;
	}

	.skill-bar {
		transform: scaleX(1) !important;
		transition: none !important;
	}

	.skill-bar::after {
		animation: none !important;
		opacity: 0 !important;
	}

	/* Two blocks are re-derived from data this repository does not hold, so their cards — and the
	   height they occupy — change without anything on the page changing. Related posts follow the
	   published post list; Top Supporters is fetched from Open Collective on every render and
	   collapses to nothing when that request fails. Hidden rather than masked: a mask paints over
	   the pixels but still lets a wrapped name move everything below it down. Their own coverage
	   lives in blog/[slug]/related-posts.e2e.ts and section-headings.e2e.ts. */
	[data-testid='related-posts'],
	[data-testid='top-supporters'] {
		display: none !important;
	}

	html {
		scroll-behavior: auto !important;
	}
`

// The like count is read from D1, so it is 0 on a fresh CI database and whatever the developer
// left behind locally. Masked rather than hidden: it sits inside a fixed-size pill, so covering
// it costs no layout.
const LIKE_BUTTON_LABEL = 'Like this post'

async function block_third_party_requests(page: Page): Promise<void> {
	await Promise.all(
		THIRD_PARTY_URL_PATTERNS.map(async (pattern) => {
			await page.route(pattern, async (route) => {
				await route.abort()
			})
		}),
	)
}

// Lazy images are the other casualty of capture-beyond-viewport: nothing scrolls, so the ones
// below the fold are never requested and would be photographed as empty boxes. Promoting them to
// eager and then waiting for every image to report complete is what fills them in.
async function settle_fonts_and_images(page: Page): Promise<void> {
	await expect(page.locator(FONT_LINK_SELECTOR)).toHaveAttribute('media', 'all', {
		timeout: SETTLE_TIMEOUT_MS,
	})

	await page.evaluate(() => {
		for (const image of document.images) image.loading = 'eager'
	})

	await page.waitForLoadState('networkidle')

	await page.waitForFunction(
		() =>
			document.fonts.status === 'loaded' && [...document.images].every((image) => image.complete),
		undefined,
		{ timeout: SETTLE_TIMEOUT_MS },
	)
}

async function prepare(page: Page, route: string, viewport: Viewport): Promise<void> {
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.setViewportSize(viewport)
	await block_third_party_requests(page)
	await test_hydration.goto_hydrated(page, route)
	await settle_fonts_and_images(page)
	await page.addStyleTag({ content: DETERMINISTIC_CSS })
}

function options(page: Page, is_full_page: boolean): VisualOptions {
	return {
		fullPage: is_full_page,
		animations: 'disabled',
		caret: 'hide',
		scale: 'css',
		maxDiffPixelRatio: MAX_DIFF_PIXEL_RATIO,
		timeout: SCREENSHOT_TIMEOUT_MS,
		mask: [page.getByRole('button', { name: LIKE_BUTTON_LABEL })],
	}
}

const test_visual = {
	DESKTOP_VIEWPORT,
	MOBILE_VIEWPORT,
	is_baseline_platform,
	NON_BASELINE_SKIP_REASON,
	options,
	prepare,
}

export { test_visual }
export type { Viewport }
