/**
 * Visual checkpoints for the pages whose layout skeletons differ from one another (#866).
 *
 * Every other spec in this suite asserts that some text, attribute or class is present, which is
 * why a collapsed grid, a lost margin or a stylesheet that never applied used to reach production
 * with the whole suite green. These four screenshots are the only assertions here that fail on a
 * change nobody described in words.
 *
 * Scope, and why it stops where it does:
 *   - `/` and `/projects` are photographed full-page. Both are rendered from static data in the
 *     repository, so the image only moves when the layout or the content genuinely moves.
 *   - `/blog/<post>` is photographed viewport-only. Its skeleton — page header, title, byline,
 *     cover image, opening prose — is what this checkpoint is for, while everything below the
 *     fold is article text that changes whenever the post is edited.
 *   - `/about` is deliberately absent: it renders seventeen emoji, which come from a system font
 *     rather than the webfonts the rest of the page uses.
 *   - `/blog` (the index) is deliberately absent: publishing a post rewrites it.
 *
 * Updating the baselines after an intentional UI change
 * -----------------------------------------------------
 * The baselines are x86_64 linux images produced inside the Playwright container image `ci.yml`
 * normally uses. Any other environment — another OS, another architecture, or a bare runner with
 * its own system fonts — skips this file rather than comparing against pixels it cannot reproduce,
 * so regenerating means Docker.
 *
 * The browser has to be x86_64; the preview server must NOT be. `wrangler dev` runs esbuild, whose
 * Go runtime deadlocks under x86_64 emulation on an Apple Silicon host — the server dies mid-run
 * and every checkpoint fails with ERR_CONNECTION_REFUSED. So the server runs natively and the
 * browser joins its network namespace, which is also why no port needs publishing and why
 * `localhost` resolves to the server from inside the second container.
 *
 * A tag holds one architecture at a time, so pin both once:
 *
 *   IMG="mcr.microsoft.com/playwright:v$(node -p "require('./package.json').devDependencies['@playwright/test'].replace('^','')")-noble"
 *   docker pull --platform linux/amd64 "$IMG" && docker tag "$IMG" pw-visual:amd64
 *   docker pull --platform "linux/$(docker version --format '{{.Server.Arch}}')" "$IMG" && docker tag "$IMG" pw-visual:native
 *
 * Then build and serve the app on the host architecture:
 *
 *   docker run -d --rm --name visual-preview \
 *     -v "$PWD":/work -v jf-visual-native:/work/node_modules -v "$HOME/.npmrc":/root/.npmrc:ro \
 *     -w /work -e CI=true -e NODE_AUTH_TOKEN pw-visual:native \
 *     bash -lc 'corepack enable && pnpm install --frozen-lockfile --ignore-scripts && pnpm prepare && pnpm build && pnpm preview'
 *
 * and, once it prints `Ready on`, photograph it from an x86_64 browser:
 *
 *   docker run --rm --platform linux/amd64 --network container:visual-preview \
 *     -v "$PWD":/work -v jf-visual-amd64:/work/node_modules -v "$HOME/.npmrc":/root/.npmrc:ro \
 *     -w /work -e CI=true -e NODE_AUTH_TOKEN -e PLAYWRIGHT_REUSE_SERVER=1 pw-visual:amd64 \
 *     bash -lc 'corepack enable && pnpm install --frozen-lockfile --ignore-scripts && pnpm exec playwright test src/routes/visual-regression.e2e.ts --update-snapshots'
 *
 *   docker rm -f visual-preview
 *
 * The two named volumes keep each architecture's `node_modules` off the host and away from each
 * other. `~/.npmrc` is mounted and `NODE_AUTH_TOKEN` forwarded because pnpm 11 refuses to expand
 * credentials from a project-level `.npmrc`, so the GitHub Packages token has to come from the
 * user-level file, which references that variable. Re-run the second command without
 * `--update-snapshots` to confirm the new baselines match, then review the written PNGs — they
 * are the change.
 */
import { expect, test } from '@playwright/test'
import { TEST_ROUTES } from '$lib/test-routes'
import { test_visual, type Viewport } from '$lib/test-visual'

const is_full_page_capture = true
const is_viewport_capture = false

// Above the 30s CI default: each checkpoint loads a page, waits for the web fonts and every image,
// and then has Playwright capture the page repeatedly until two captures agree.
const CHECKPOINT_TIMEOUT_MS = 60_000

interface Checkpoint {
	name: string
	route: string
	viewport: Viewport
	is_full_page: boolean
}

// The test name is also the baseline filename, so keep these short and stable — renaming one
// orphans its PNG.
const CHECKPOINTS: ReadonlyArray<Checkpoint> = [
	{
		name: 'home desktop',
		route: TEST_ROUTES.HOME,
		viewport: test_visual.DESKTOP_VIEWPORT,
		is_full_page: is_full_page_capture,
	},
	{
		name: 'home mobile',
		route: TEST_ROUTES.HOME,
		viewport: test_visual.MOBILE_VIEWPORT,
		is_full_page: is_full_page_capture,
	},
	{
		name: 'projects desktop',
		route: TEST_ROUTES.PROJECTS,
		viewport: test_visual.DESKTOP_VIEWPORT,
		is_full_page: is_full_page_capture,
	},
	{
		name: 'blog post desktop',
		route: TEST_ROUTES.BLOG_POST,
		viewport: test_visual.DESKTOP_VIEWPORT,
		is_full_page: is_viewport_capture,
	},
]

test.describe('Visual checkpoint', () => {
	test.describe.configure({ timeout: CHECKPOINT_TIMEOUT_MS })

	// Not a disabled test: the baselines are committed for one platform — linux, what CI runs — so
	// on any other host there is nothing to compare against. test-visual.ts explains why a second
	// set of baselines would be worse than skipping.
	test.skip(!test_visual.is_baseline_platform, test_visual.NON_BASELINE_SKIP_REASON)

	for (const checkpoint of CHECKPOINTS) {
		test(checkpoint.name, async ({ page }) => {
			await test_visual.prepare(page, checkpoint.route, checkpoint.viewport)

			await expect(page).toHaveScreenshot(test_visual.options(page, checkpoint.is_full_page))
		})
	}
})
