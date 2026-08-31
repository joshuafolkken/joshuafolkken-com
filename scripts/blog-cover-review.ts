#!/usr/bin/env tsx
/**
 * Build the cover-image candidate comparison page for a blog post.
 *
 * Candidates cannot be judged from a list of filenames and URLs, and a terminal cannot show them,
 * so this renders them side by side into one HTML file: image, rank, why that rank, the source and
 * license line, and the filename to use if the candidate is adopted.
 *
 * The two kinds of candidate the blog actually uses are both accepted in one manifest — a free
 * photo named by its URL (Unsplash / Pexels, with a credit line) and a generated image named by its
 * path under `.covers/<slug>/`, which is what `pnpm blog:cover` writes.
 *
 * **Every image is inlined as a `data:` URI, remote ones included.** That is what makes the output
 * a single file rather than a page with dependencies, and it is also what makes it publishable:
 * an Artifact's CSP blocks images from every external host, so a page linking to Unsplash would
 * render as five broken frames for whoever the URL is handed to. A candidate whose image cannot be
 * fetched or read is still rendered, with the reason in place of the picture — never dropped.
 *
 * The manifest is JSON:
 *
 *   {
 *     "post": "my-post-slug",
 *     "candidates": [
 *       {
 *         "rank": 1,
 *         "source": ".covers/my-post-slug/20260831-120000-01.png",
 *         "reason": "本文の主題と合っていて、文字を入れる余白がある",
 *         "credit": "",
 *         "license_url": "",
 *         "filename": "my-post-slug.png"
 *       },
 *       {
 *         "rank": 2,
 *         "source": "https://images.unsplash.com/photo-123",
 *         "reason": "色は良いが主題からやや離れる",
 *         "credit": "Photo by Someone on Unsplash",
 *         "license_url": "https://unsplash.com/license",
 *         "filename": "my-post-slug.jpg"
 *       }
 *     ]
 *   }
 *
 * `rank`, `source` and `reason` are required; `credit`, `license_url` and `filename` default to
 * empty and are rendered as a marked blank, so a candidate with no license line is visible as one
 * rather than quietly indistinguishable from a candidate that needs no attribution.
 *
 * Usage:
 *   pnpm blog:cover:review <manifest.json>              # → .covers/<post>/review.html
 *   pnpm blog:cover:review <manifest.json> <out.html>
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { blog_cover_assets } from './blog-cover-assets'
import { blog_cover_review_page, type ReviewCandidate } from './blog-cover-review-page'
import { cli } from './cli'

const DEFAULT_PAGE_NAME = 'review.html'
const OUTPUT_ARGUMENT_MAX = 1
const REVIEW_USAGE = 'Usage: pnpm blog:cover:review <manifest.json> [output.html]'
const REMOTE_PREFIXES = ['http://', 'https://'] as const
const CONTENT_TYPE_HEADER = 'content-type'
const BASE64 = 'base64'
// An Artifact publish refuses a rendered page above 16MB, and inlined images are what fills it, so
// the size is reported next to the path rather than discovered at publish time.
const ARTIFACT_LIMIT_MEGABYTES = 16
const BYTES_PER_KILOBYTE = 1024
const ARTIFACT_LIMIT_BYTES = ARTIFACT_LIMIT_MEGABYTES * BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE

const HTTP_PROTOCOL_PATTERN = /^https?$/u
const EXTENSION_DOT = '.'
const POST_PATTERN = /^[\w.-]+$/u
const FETCH_TIMEOUT_MS = 20_000

const CANDIDATE_SCHEMA = z.object({
	rank: z.number().int().positive(),
	source: z.string().min(1),
	reason: z.string().min(1),
	credit: z.string().default(''),
	// Only an http(s) URL, because it becomes an `href` on a page written to be published and
	// shared — a `javascript:` value there would be a live link in someone else's browser.
	license_url: z.union([z.literal(''), z.url({ protocol: HTTP_PROTOCOL_PATTERN })]).default(''),
	filename: z.string().default(''),
})

const MANIFEST_SCHEMA = z.object({
	// Restricted to a slug because it becomes a path segment of the default output directory: a
	// `post` carrying `..` or a separator would write the page outside the covers directory.
	post: z.string().min(1).regex(POST_PATTERN),
	candidates: z.array(CANDIDATE_SCHEMA).min(1),
})

type CandidateInput = z.infer<typeof CANDIDATE_SCHEMA>
type ReviewManifest = z.infer<typeof MANIFEST_SCHEMA>

interface RemoteImage {
	mime_type: string
	bytes: Uint8Array
}

interface ReviewResult {
	output_path: string
	html: string
	count: number
}

interface ReviewDependencies {
	read_manifest: (manifest_path: string) => string
	read_local_image: (source: string) => Uint8Array
	fetch_remote_image: (url: string) => Promise<RemoteImage>
	write_page: (output_path: string, html: string) => void
}

// Lower-cased first: a scheme is case-insensitive, and an `HTTPS://` source read as a local path
// reaches `readFileSync` and comes back as a missing-file card for a URL that was fetchable.
function is_remote(source: string): boolean {
	const lowered = source.toLowerCase()

	return REMOTE_PREFIXES.some((prefix) => lowered.startsWith(prefix))
}

function parse_manifest(raw: string): ReviewManifest {
	return MANIFEST_SCHEMA.parse(JSON.parse(raw))
}

// Sorted by rank so the page reads top-to-bottom in the order the manifest ranked them, whatever
// order the entries were typed in. Equal ranks keep their manifest order.
function sort_candidates(candidates: ReadonlyArray<CandidateInput>): ReadonlyArray<CandidateInput> {
	return candidates.toSorted((left, right) => left.rank - right.rank)
}

function resolve_output_path(manifest: ReviewManifest, requested: string | undefined): string {
	if (requested !== undefined && requested !== '') return requested

	return path.join(blog_cover_assets.COVERS_DIR, manifest.post, DEFAULT_PAGE_NAME)
}

function to_data_uri(mime_type: string, bytes: Uint8Array): string {
	return `data:${mime_type};${BASE64},${Buffer.from(bytes).toString(BASE64)}`
}

// The extension is the only thing a local path says about its type, so an unknown one is reported
// rather than guessed: a mislabelled `data:` URI renders as a broken image with no reason attached.
function local_mime_type(source: string): string {
	const extension = path.extname(source).replace(EXTENSION_DOT, '')
	const mime_type = blog_cover_assets.mime_for_extension(extension)

	if (mime_type === undefined) throw new Error(`Unsupported image extension: ${source}`)

	return mime_type
}

async function load_remote(dependencies: ReviewDependencies, source: string): Promise<string> {
	const image = await dependencies.fetch_remote_image(source)

	// Checked against the exact set rather than an `image/` prefix. The type comes from a header the
	// remote host controls, and it is spliced into the `data:` URI this returns — a value such as
	// `image/png" onerror="…` passes a prefix test and then breaks out of the `src` attribute of a
	// page written to be published and shared.
	if (!blog_cover_assets.is_supported_mime(image.mime_type)) {
		throw new Error(`Unsupported image type (${image.mime_type}): ${source}`)
	}

	return to_data_uri(image.mime_type, image.bytes)
}

function load_local(dependencies: ReviewDependencies, source: string): string {
	return to_data_uri(local_mime_type(source), dependencies.read_local_image(source))
}

async function load_image(dependencies: ReviewDependencies, source: string): Promise<string> {
	if (is_remote(source)) return await load_remote(dependencies, source)

	return load_local(dependencies, source)
}

function describe_error(error: unknown): string {
	return error instanceof Error ? error.message : String(error)
}

// A candidate that cannot be embedded still becomes a card carrying the reason. Dropping it would
// leave the reviewer comparing four images against a manifest of five without being told which one
// went missing.
async function resolve_candidate(
	dependencies: ReviewDependencies,
	candidate: CandidateInput,
): Promise<ReviewCandidate> {
	try {
		const image_source = await load_image(dependencies, candidate.source)

		return { ...candidate, image_source, load_error: '' }
	} catch (error) {
		return { ...candidate, image_source: '', load_error: describe_error(error) }
	}
}

// Sequential rather than parallel: a manifest mixes remote fetches with local reads, and firing
// every fetch at once at one photo host is what turns a review page into rate-limited failures.
async function resolve_candidates(
	dependencies: ReviewDependencies,
	candidates: ReadonlyArray<CandidateInput>,
): Promise<ReadonlyArray<ReviewCandidate>> {
	const resolved: Array<ReviewCandidate> = []

	for (const candidate of candidates) {
		resolved.push(await resolve_candidate(dependencies, candidate))
	}

	return resolved
}

// The timeout matters because `resolve_candidates` is sequential: without it one unresponsive photo
// host stalls the whole run with no output, instead of becoming one card carrying the reason.
async function fetch_remote_image(url: string): Promise<RemoteImage> {
	const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })

	if (!response.ok) throw new Error(`HTTP ${String(response.status)}: ${url}`)

	return {
		mime_type: response.headers.get(CONTENT_TYPE_HEADER)?.split(';', 1)[0]?.trim() ?? '',
		bytes: new Uint8Array(await response.arrayBuffer()),
	}
}

function write_page(output_path: string, html: string): void {
	mkdirSync(path.dirname(output_path), { recursive: true })
	writeFileSync(output_path, html)
}

function build_dependencies(): ReviewDependencies {
	return {
		read_manifest(manifest_path: string): string {
			return readFileSync(manifest_path, 'utf8')
		},
		read_local_image(source: string): Uint8Array {
			return readFileSync(source)
		},
		fetch_remote_image,
		write_page,
	}
}

async function run(
	dependencies: ReviewDependencies,
	manifest_path: string,
	requested_output: string | undefined,
	now: Date,
): Promise<ReviewResult> {
	const manifest = parse_manifest(dependencies.read_manifest(manifest_path))
	const candidates = await resolve_candidates(dependencies, sort_candidates(manifest.candidates))
	const html = blog_cover_review_page.render_page({
		post: manifest.post,
		generated_at: now.toISOString(),
		candidates,
	})
	const output_path = resolve_output_path(manifest, requested_output)

	dependencies.write_page(output_path, html)

	return { output_path, html, count: candidates.length }
}

function report(result: ReviewResult): void {
	const bytes = Buffer.byteLength(result.html)
	const summary = `${String(result.count)} candidate(s), ${String(bytes)} bytes`

	console.info(`Wrote ${result.output_path} (${summary})`)

	if (bytes > ARTIFACT_LIMIT_BYTES) {
		console.warn(
			`Above the ${String(ARTIFACT_LIMIT_BYTES)}-byte Artifact ceiling; a publish is refused.`,
		)
	}
}

async function main(args: ReadonlyArray<string>, now: Date): Promise<void> {
	const { value: manifest_path, rest } = cli.read_argument_with_rest(
		args,
		REVIEW_USAGE,
		OUTPUT_ARGUMENT_MAX,
	)

	report(await run(build_dependencies(), manifest_path, rest[0], now))
}

const CLI_ARGS_START = 2

const is_main_module = import.meta.url === `file://${process.argv[1] ?? ''}`

if (is_main_module) {
	try {
		await main(process.argv.slice(CLI_ARGS_START), new Date())
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

const blog_cover_review = {
	ARTIFACT_LIMIT_BYTES,
	is_remote,
	parse_manifest,
	sort_candidates,
	resolve_output_path,
	local_mime_type,
	resolve_candidates,
	build_dependencies,
	run,
	main,
}

export type { CandidateInput, RemoteImage, ReviewDependencies, ReviewManifest, ReviewResult }
export { blog_cover_review }
