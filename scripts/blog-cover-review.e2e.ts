/**
 * Renders the cover-image comparison page from fixture candidates and photographs it.
 *
 * The page is a standalone HTML fragment rather than a route of this site, so it is loaded with
 * `setContent` instead of a navigation — there is no server to serve it from, and there should not
 * be one. The screenshot is what closes the UI verification gate for this generator: the unit tests
 * assert which strings are in the markup, and stay green while the layout is visibly broken.
 *
 * The fixtures are generated here rather than committed: no cover image has been produced by
 * `pnpm blog:cover` yet (the image models need a billed key), and a fixture that has to look like
 * a photograph only has to be a distinguishable rectangle.
 */
import { expect, test } from '@playwright/test'
import sharp from 'sharp'
import type { FetchedImage } from './blog-cover-assets'
import { blog_cover_review, type ReviewDependencies } from './blog-cover-review'

const POST = 'ranked-cover-review'
const SCREENSHOT_PATH = 'test-results/blog-cover-review-page.png'
const NARROW_SCREENSHOT_PATH = 'test-results/blog-cover-review-page-narrow.png'
const NARROW_VIEWPORT = { width: 375, height: 800 }
const FIXTURE_WIDTH = 480
const FIXTURE_HEIGHT = 270
const CANDIDATE_COUNT = 5
const REMOTE_SOURCE = 'https://images.example.test/photo-1.jpg'
const JPEG_MIME = 'image/jpeg'
const COLORS = ['#2f6fb0', '#b0532f', '#3f8f5a', '#7a4fa3', '#a38f2f'] as const
const GENERATED_CREDIT = '生成画像（Gemini）'
const CARD_SELECTOR = 'li.candidate'
const fixtures: Array<Uint8Array> = []

const CANDIDATES = [
	{
		rank: 1,
		source: `.covers/${POST}/20260831-120000-01.png`,
		reason: '記事の主題である「順位づけ」がそのまま図になっていて、余白も十分にある',
		filename: `${POST}.png`,
	},
	{
		rank: 2,
		source: REMOTE_SOURCE,
		reason: '色味は最も良いが、主題との結びつきがやや弱い',
		credit: 'Photo by Someone on Unsplash',
		license_url: 'https://unsplash.com/license',
		filename: `${POST}.jpg`,
	},
	{
		rank: 3,
		source: `.covers/${POST}/20260831-120000-03.png`,
		reason: 'ライセンス表記が未記入のまま。採用するなら出典を確認する必要がある',
		filename: `${POST}-3.png`,
	},
	{
		rank: 4,
		source: `.covers/${POST}/20260831-120000-04.png`,
		reason: '構図は素直だが、他の候補と比べて印象が弱い',
		credit: GENERATED_CREDIT,
		filename: '',
	},
	{
		rank: 5,
		source: '.covers/missing/not-generated.png',
		reason: '取り込みに失敗した候補も、落とさずに理由つきで並べる',
		credit: GENERATED_CREDIT,
		filename: `${POST}-5.png`,
	},
] as const

// A flat SVG rectangle rendered to PNG. Going through SVG rather than sharp's own `create` option
// keeps the fixture a plain buffer input, which is the same path `scripts/svg-to-png.ts` takes.
async function make_png(color: string): Promise<Uint8Array> {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${String(FIXTURE_WIDTH)}" height="${String(FIXTURE_HEIGHT)}"><rect width="100%" height="100%" fill="${color}"/></svg>`

	return new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer())
}

function fixture_at(index: number): Uint8Array {
	return fixtures[index] ?? new Uint8Array()
}

// The fixture index is taken from the `-0N.png` suffix `pnpm blog:cover` writes, so a source that
// names no generated candidate fails the way a missing file does.
function read_fixture(source: string): Uint8Array {
	const index = COLORS.findIndex((_color, position) =>
		source.includes(`-0${String(position + 1)}.png`),
	)

	if (index === -1) throw new Error(`ENOENT: no such file, open '${source}'`)

	return fixture_at(index)
}

function make_dependencies(manifest: string, pages: Array<string>): ReviewDependencies {
	return {
		read_manifest: () => manifest,
		read_local_image: read_fixture,
		fetch_remote_image: async (): Promise<FetchedImage> => ({
			mime_type: JPEG_MIME,
			bytes: fixture_at(1),
		}),
		write_page: (_output_path: string, html: string): void => {
			pages.push(html)
		},
	}
}

test.beforeAll(async () => {
	for (const color of COLORS) fixtures.push(await make_png(color))
})

async function render_fixture_page(): Promise<string> {
	const manifest = JSON.stringify({ post: POST, candidates: CANDIDATES })
	const pages: Array<string> = []
	const dependencies = make_dependencies(manifest, pages)

	await blog_cover_review.run(dependencies, 'manifest.json', undefined, new Date())

	return pages[0] ?? ''
}

test('the comparison page ranks every candidate and shows both image sources', async ({ page }) => {
	await page.setContent(await render_fixture_page())

	const cards = page.locator(CARD_SELECTOR)

	await expect(cards).toHaveCount(CANDIDATE_COUNT)
	await expect(cards.first().locator('.rank b')).toHaveText('1')
	await expect(cards.last().locator('.rank b')).toHaveText(String(CANDIDATE_COUNT))
	await expect(page.locator(`${CARD_SELECTOR} img`)).toHaveCount(CANDIDATE_COUNT - 1)
	await expect(page.locator(`${CARD_SELECTOR} .missing-image`)).toHaveCount(1)
	await expect(page.locator('.empty').first()).toBeVisible()

	await page.screenshot({ path: SCREENSHOT_PATH, fullPage: true })
})

// The page is meant to be published and opened on a phone, and a grid track with a fixed minimum
// scrolls the body sideways there while every assertion above stays green.
test('the page does not scroll sideways on a narrow phone', async ({ page }) => {
	await page.setViewportSize(NARROW_VIEWPORT)
	await page.setContent(await render_fixture_page())

	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	)

	expect(overflow).toBeLessThanOrEqual(0)

	await page.screenshot({ path: NARROW_SCREENSHOT_PATH })
})
