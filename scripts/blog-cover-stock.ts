#!/usr/bin/env tsx
/**
 * Collect free stock photo candidates for a blog post's cover image.
 *
 * This is the route that works when the Gemini generator cannot run. Its image models have no free
 * tier at all, so a key from a project without billing is refused with `429 RESOURCE_EXHAUSTED` and
 * `limit: 0` on the first request and produces nothing. Nothing here talks to that generator or to
 * any billed service: the search is Openverse, which needs no key and no account.
 *
 * Openverse indexes the CC-licensed and public-domain images of Flickr, StockSnap, Rawpixel,
 * Wikimedia and others, and returns a license and an attribution line with every result. That is
 * why it is the source: the manifest's `credit` and `license_url` come from the API rather than
 * from a guess, and a result carrying no license URL is dropped rather than written out blank.
 * The default license filter is CC0, the Public Domain Mark and CC BY — the set that permits
 * commercial use and modification with attribution alone, which is what a blog cover needs.
 *
 * Candidates are downloaded into `.covers/<slug>/`, the same git-ignored directory
 * `pnpm blog:cover` writes to, and the manifest names them by path rather than by remote URL: the
 * picked file has to be on disk to be copied into the blog anyway, and a saved file cannot rot or
 * rate-limit the way a photo host's URL can. Nothing is written to `src/lib/assets/images/blog/`.
 *
 * The keywords default to the post's own `title`, which only finds anything when the title is in
 * English — Openverse searches English metadata. Pass keywords explicitly for a Japanese post.
 *
 * Usage:
 *   pnpm blog:cover:stock <post-slug-or-path>                        # 5 candidates (the default)
 *   pnpm blog:cover:stock <post-slug-or-path> 8
 *   pnpm blog:cover:stock <post-slug-or-path> 5 "developer desk laptop"
 *
 * Then review them:
 *   pnpm blog:cover:review .covers/<slug>/<stamp>-stock.json
 *
 * Required env: none. The Openverse API is anonymous; it allows 20 requests a minute and 200 a
 * day, and one run spends exactly one of them.
 *
 * Optional env (see .env.example):
 *   BLOG_STOCK_LICENSES  (default cc0,pdm,by)
 *   BLOG_STOCK_SOURCES   (default unset — every provider; e.g. stocksnap,rawpixel)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { blog_cover_assets, type FetchedImage } from './blog-cover-assets'
import { blog_cover_openverse, type StockConfig, type StockResult } from './blog-cover-openverse'
import { blog_post_source } from './blog-post-source'
import { cli } from './cli'

const BLOG_IMAGES_DIR = 'src/lib/assets/images/blog'
const DEFAULT_CANDIDATE_COUNT = 5
const MAX_CANDIDATE_COUNT = 10
const REST_ARGUMENT_MAX = 2
const CLI_ARGS_START = 2
const INDEX_PAD_WIDTH = 2
// Only the frontmatter title is read from the post, so the body is truncated to nearly nothing.
const TITLE_KEYWORD_LIMIT = 200
// How many results past the requested count the loop is willing to try before giving up, so a run
// against a host refusing every download ends rather than walking the whole page.
const SPARE_RESULT_LIMIT = 5
// The review page inlines every candidate as base64, which costs about a third again in bytes, and
// an Artifact publish refuses a page above 16MB. Openverse hands back the provider's original —
// tens of megabytes from Wikimedia and Rawpixel — so the budget is enforced here, where an
// oversized candidate costs itself and the spare behind it takes its place, rather than discovered
// after the page has already been built out of five of them.
const PAGE_BYTE_BUDGET = 11_000_000
// `src/lib/data/blog-images.ts` globs the blog image directory for these three only, so a
// candidate saved as anything else would resolve to nothing once its filename reached frontmatter.
const BLOG_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png'])
const STOCK_USAGE = `Usage: pnpm blog:cover:stock <post-slug-or-path> [count] [keywords]
  the keywords come after the count, so pass both when passing either`

interface StockRequest {
	slug_or_path: string
	count: number
	query: string
}

interface StockPlan {
	slug: string
	query: string
	count: number
	run_stamp: string
}

interface StockCandidate {
	rank: number
	source: string
	reason: string
	credit: string
	license_url: string
	filename: string
}

interface ImageVerdict {
	extension: string
	rejection: string
}

interface StockResultSummary {
	manifest_path: string
	count: number
}

interface StockDependencies {
	read_post: (post_path: string) => string
	search: (query: string, count: number) => Promise<ReadonlyArray<StockResult>>
	download: (url: string) => Promise<FetchedImage>
	write_file: (output_path: string, data: string | Uint8Array) => void
}

// The rank is the search's own order, and the reason says so rather than pretending to a judgement
// no script made — the person re-ranks on the review page, and needs to know what they are editing.
function candidate_reason(result: StockResult, plan: StockPlan, rank: number): string {
	const size =
		result.width > 0 && result.height > 0
			? `${String(result.width)}×${String(result.height)} / `
			: ''

	return `Openverse 検索「${plan.query}」の ${String(rank)} 番目 — ${result.provider} / ${size}${blog_cover_openverse.license_label(result)}`
}

// Answers undefined for a type the blog's image glob would not pick up, which is what keeps an
// unusable candidate out of the manifest rather than into a frontmatter value that resolves to
// nothing. Checked against the supported set first: `extension_for_mime` falls back to png, so an
// unknown type would otherwise be saved under an extension that lies about its contents.
function usable_extension(mime_type: string): string | undefined {
	if (!blog_cover_assets.is_supported_mime(mime_type)) return undefined

	const extension = blog_cover_assets.extension_for_mime(mime_type)

	return BLOG_IMAGE_EXTENSIONS.has(extension) ? extension : undefined
}

function resolve_image_path(plan: StockPlan, rank: number, extension: string): string {
	const number = String(rank).padStart(INDEX_PAD_WIDTH, '0')

	return path.join(
		blog_cover_assets.COVERS_DIR,
		plan.slug,
		`${plan.run_stamp}-stock-${number}.${extension}`,
	)
}

function resolve_manifest_path(plan: StockPlan): string {
	return path.join(blog_cover_assets.COVERS_DIR, plan.slug, `${plan.run_stamp}-stock.json`)
}

// The saved name and the reason it cannot be saved, decided together so the caller has one verdict
// to act on rather than a chain of guards. `rejection` is empty exactly when the image is usable.
function verify_image(image: FetchedImage, plan: StockPlan): ImageVerdict {
	const extension = usable_extension(image.mime_type)

	if (extension === undefined) {
		return { extension: '', rejection: `unusable image type (${image.mime_type})` }
	}

	const budget = Math.floor(PAGE_BYTE_BUDGET / plan.count)

	if (image.bytes.length > budget) {
		const size = String(image.bytes.length)

		return { extension, rejection: `${size} bytes, over the ${String(budget)} a candidate may use` }
	}

	return { extension, rejection: '' }
}

async function save_candidate(
	dependencies: StockDependencies,
	result: StockResult,
	plan: StockPlan,
	rank: number,
): Promise<StockCandidate | undefined> {
	const image = await dependencies.download(result.url)
	const { extension, rejection } = verify_image(image, plan)

	if (rejection !== '') {
		console.warn(`  skipped ${result.url}: ${rejection}`)

		return undefined
	}

	const source = resolve_image_path(plan, rank, extension)

	dependencies.write_file(source, image.bytes)
	console.info(`  saved ${source}`)

	return {
		rank,
		source,
		reason: candidate_reason(result, plan, rank),
		credit: blog_cover_openverse.credit_line(result),
		license_url: result.license_url,
		filename: `${plan.slug}.${extension}`,
	}
}

// One host refusing a download costs its own candidate and nothing else. The reason is printed
// because the alternative — a run that quietly returns four of five — reads as a thin search.
async function try_save_candidate(
	dependencies: StockDependencies,
	result: StockResult,
	plan: StockPlan,
	rank: number,
): Promise<ReadonlyArray<StockCandidate>> {
	try {
		const candidate = await save_candidate(dependencies, result, plan, rank)

		return candidate === undefined ? [] : [candidate]
	} catch (error) {
		console.warn(
			`  skipped ${result.url}: ${error instanceof Error ? error.message : String(error)}`,
		)

		return []
	}
}

// Sequential rather than parallel, and it stops the moment it has what was asked for: firing every
// download at once at one photo host is what turns a search into rate-limited failures, and the
// over-fetched results beyond the count are there as spares rather than as work to do.
async function collect_candidates(
	dependencies: StockDependencies,
	results: ReadonlyArray<StockResult>,
	plan: StockPlan,
): Promise<ReadonlyArray<StockCandidate>> {
	const candidates: Array<StockCandidate> = []
	const attempts = results.slice(0, plan.count + SPARE_RESULT_LIMIT)

	for (const result of attempts) {
		if (candidates.length >= plan.count) break

		candidates.push(
			...(await try_save_candidate(dependencies, result, plan, candidates.length + 1)),
		)
	}

	return candidates
}

// Refused before anything is downloaded, and it names the keywords that came up short: the usual
// cause is a Japanese title reaching an index whose metadata is English, and a run that half-filled
// a manifest instead would hide that behind a review page with two cards on it.
function require_enough_results(results: ReadonlyArray<StockResult>, plan: StockPlan): void {
	if (results.length >= plan.count) return

	throw new Error(
		`Openverse returned ${String(results.length)} usable result(s) for "${plan.query}", fewer than the ${String(plan.count)} requested.\n` +
			`  Pass broader English keywords: pnpm blog:cover:stock <post> ${String(plan.count)} "<keywords>"`,
	)
}

function write_file(output_path: string, data: string | Uint8Array): void {
	mkdirSync(path.dirname(output_path), { recursive: true })
	writeFileSync(output_path, data)
}

function build_dependencies(config: StockConfig): StockDependencies {
	return {
		read_post(post_path: string): string {
			return readFileSync(post_path, 'utf8')
		},
		async search(query: string, count: number): Promise<ReadonlyArray<StockResult>> {
			return await blog_cover_openverse.search(config, query, count)
		},
		download: blog_cover_assets.fetch_image,
		write_file,
	}
}

function encode_manifest(plan: StockPlan, candidates: ReadonlyArray<StockCandidate>): string {
	return `${JSON.stringify({ post: plan.slug, candidates }, undefined, '\t')}\n`
}

// The keywords fall back to the post's own title, which is why the post is read at all: nothing
// else here needs its body.
function read_plan(dependencies: StockDependencies, request: StockRequest, now: Date): StockPlan {
	const post_path = blog_post_source.resolve_post_path(request.slug_or_path)
	const markdown = dependencies.read_post(post_path)
	const post = blog_post_source.read_summary(post_path, markdown, TITLE_KEYWORD_LIMIT)

	return {
		slug: post.slug,
		query: request.query === '' ? post.title : request.query,
		count: request.count,
		run_stamp: blog_cover_assets.format_run_stamp(now),
	}
}

// A manifest with no candidates is refused rather than written: `blog:cover:review` requires at
// least one, so a file this command promised was reviewable would fail the moment it was opened.
// The search filters on indexed metadata, so a provider serving a type the blog cannot use — or a
// hotlink-protection page answering 200 — really can cost every result in one run.
function require_saved_candidates(
	candidates: ReadonlyArray<StockCandidate>,
	plan: StockPlan,
): void {
	if (candidates.length > 0) return

	throw new Error(
		`No candidate could be saved for "${plan.query}": every result was skipped for the reason printed above it.`,
	)
}

async function run(
	dependencies: StockDependencies,
	request: StockRequest,
	now: Date,
): Promise<StockResultSummary> {
	const plan = read_plan(dependencies, request, now)

	console.info(`Searching Openverse for "${plan.query}"...`)

	const results = await dependencies.search(plan.query, plan.count)

	require_enough_results(results, plan)

	const candidates = await collect_candidates(dependencies, results, plan)

	require_saved_candidates(candidates, plan)

	const manifest_path = resolve_manifest_path(plan)

	dependencies.write_file(manifest_path, encode_manifest(plan, candidates))

	return { manifest_path, count: candidates.length }
}

function report(summary: StockResultSummary, requested: number): void {
	console.info(`Wrote ${summary.manifest_path} (${String(summary.count)} candidate(s))`)

	if (summary.count < requested) {
		console.warn(`Only ${String(summary.count)} of ${String(requested)} downloads succeeded.`)
	}

	console.info(`Review them with: pnpm blog:cover:review ${summary.manifest_path}`)
	console.info(`Copy the one you pick into ${BLOG_IMAGES_DIR}; this command never writes there.`)
}

async function main(args: ReadonlyArray<string>, now: Date): Promise<void> {
	const { value: slug_or_path, rest } = cli.read_argument_with_rest(
		args,
		STOCK_USAGE,
		REST_ARGUMENT_MAX,
	)
	const count = cli.parse_count(rest[0], STOCK_USAGE, DEFAULT_CANDIDATE_COUNT, MAX_CANDIDATE_COUNT)
	const request: StockRequest = { slug_or_path, count, query: rest[1] ?? '' }
	const dependencies = build_dependencies(blog_cover_openverse.read_config())

	report(await run(dependencies, request, now), count)
}

const is_main_module = import.meta.url === `file://${process.argv[1] ?? ''}`

if (is_main_module) {
	try {
		await main(process.argv.slice(CLI_ARGS_START), new Date())
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

const blog_cover_stock = {
	DEFAULT_CANDIDATE_COUNT,
	MAX_CANDIDATE_COUNT,
	PAGE_BYTE_BUDGET,
	candidate_reason,
	usable_extension,
	verify_image,
	resolve_image_path,
	resolve_manifest_path,
	collect_candidates,
	encode_manifest,
	build_dependencies,
	run,
	main,
}

export type { StockCandidate, StockDependencies, StockPlan, StockRequest }
export { blog_cover_stock }
