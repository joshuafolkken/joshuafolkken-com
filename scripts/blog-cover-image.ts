#!/usr/bin/env tsx
/**
 * Generate cover image candidates for a blog post with a Gemini image model.
 *
 * Reads the post's frontmatter `title` / `excerpt` plus the opening of its body, appends them to
 * `prompts/blog-cover-image.md`, and asks the model for one image per candidate — a separate
 * request each, so every candidate is an independent take rather than a variation of one.
 *
 * Candidates land in `.covers/<slug>/` (git-ignored). Nothing is written to
 * `src/lib/assets/images/blog/`: a person copies the one candidate that gets picked, so a
 * generated image never reaches the repository on the strength of a script run alone.
 *
 * The prompt forbids text inside the image. Generated lettering comes out malformed, and a cover
 * with broken glyphs is unusable however good the rest of the picture is.
 *
 * Usage:
 *   pnpm blog:cover <post-slug-or-path>        # 3 candidates (the default)
 *   pnpm blog:cover <post-slug-or-path> 5      # 5 candidates
 *
 * Cost: every candidate is one billed image, so a run costs the count times the per-image price.
 * On the default `gemini-3.1-flash-image` at 1K that is about US$0.067 per image — roughly
 * US$0.20 for the default 3 — and about US$0.134 per image on `gemini-3-pro-image`. Prices from
 * https://ai.google.dev/gemini-api/docs/pricing (checked 2026-08-31). A count above
 * MAX_IMAGE_COUNT is refused rather than clamped, so a mistyped argument cannot bill an
 * unbounded run and never silently bills a smaller one either.
 *
 * The image models have no free tier at all — a key without billing gets `429
 * RESOURCE_EXHAUSTED` with `limit: 0` on the very first request rather than a smaller allowance —
 * so `GEMINI_API_KEY` has to come from a project with billing enabled, which the text models this
 * repository already calls do not require.
 *
 * Required env (see .env.example):
 *   GEMINI_API_KEY
 * Optional env:
 *   BLOG_COVER_MODEL   (default gemini-3.1-flash-image)
 *   BLOG_COVER_PROMPT  (default prompts/blog-cover-image.md)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { GoogleGenAI, type Part } from '@google/genai'
import { blog_cover_assets } from './blog-cover-assets'
import { blog_post_source, type PostSummary } from './blog-post-source'
import { cli } from './cli'
import { environment } from './environment'

const BLOG_IMAGES_DIR = 'src/lib/assets/images/blog'
const DEFAULT_MODEL = 'gemini-3.1-flash-image'
const DEFAULT_PROMPT_PATH = 'prompts/blog-cover-image.md'
const DEFAULT_IMAGE_COUNT = 3
const MAX_IMAGE_COUNT = 10
const COUNT_ARGUMENT_MAX = 1
const BODY_CHARACTER_LIMIT = 2000
const INDEX_PAD_WIDTH = 2
const CLI_ARGS_START = 2
const IMAGE_MODALITY = 'IMAGE'
// A blog card is rendered wide, and 1K is the cheapest size these models bill.
const ASPECT_RATIO = '16:9'
const IMAGE_SIZE = '1K'
const COVER_USAGE = 'Usage: pnpm blog:cover <post-slug-or-path> [count]'

interface CoverConfig {
	api_key: string
	model: string
	prompt_path: string
}

interface CoverImage {
	mime_type: string
	bytes: Uint8Array
}

// The slice of a generation response this script reads, kept structural so a test can feed a plain
// object instead of constructing an SDK response class.
interface ImageResponse {
	candidates?:
		| Array<{
				content?: { parts?: Array<Part> } | undefined
				finishReason?: string | undefined
		  }>
		| undefined
	promptFeedback?: { blockReason?: string | undefined } | undefined
}

interface CoverDependencies {
	read_post: (post_path: string) => string
	read_prompt: () => string
	// `on_image` is called as each candidate arrives rather than once at the end: every candidate
	// is already billed by then, so a rate-limit rejection on a later one must not discard the
	// images that were paid for and produced before it.
	generate: (prompt: string, count: number, on_image: (image: CoverImage) => void) => Promise<void>
	write_image: (output_path: string, bytes: Uint8Array) => void
}

function read_config(): CoverConfig {
	return {
		api_key: environment.require_environment('GEMINI_API_KEY'),
		model: environment.optional_environment('BLOG_COVER_MODEL', DEFAULT_MODEL),
		prompt_path: environment.optional_environment('BLOG_COVER_PROMPT', DEFAULT_PROMPT_PATH),
	}
}

// The template carries the style and the no-text rule; the post's own words are appended below it,
// so tuning the instructions never means touching this file.
function build_prompt(template: string, post: PostSummary): string {
	return [
		template.trim(),
		'# 対象記事',
		`タイトル: ${post.title}`,
		`要約: ${post.excerpt}`,
		'本文（冒頭抜粋）:',
		post.body,
	].join('\n\n')
}

// Every candidate is billed, so an out-of-range count is refused rather than clamped — the rule
// itself lives in `cli` because the stock collector applies it too.
function parse_count(raw: string | undefined): number {
	return cli.parse_count(raw, COVER_USAGE, DEFAULT_IMAGE_COUNT, MAX_IMAGE_COUNT)
}

// Named after what the image actually is rather than after whatever the default happened to be.
// The table is shared with the review script, which reads these filenames back — see
// `blog-cover-assets.ts` for why the two cannot each keep their own.
function extension_for_image(mime_type: string): string {
	return blog_cover_assets.extension_for_mime(mime_type)
}

function resolve_output_path(
	slug: string,
	run_stamp: string,
	index: number,
	mime_type: string,
): string {
	const number = String(index + 1).padStart(INDEX_PAD_WIDTH, '0')

	const name = `${run_stamp}-${number}.${extension_for_image(mime_type)}`

	return path.join(blog_cover_assets.COVERS_DIR, slug, name)
}

function describe_text_parts(parts: ReadonlyArray<Part>): string {
	const text = parts
		.map((part) => part.text)
		.filter((value) => value !== undefined && value !== '')
		.join(' ')

	return text === '' ? '(no text in the response)' : text
}

// A safety or policy block is the failure this reports most often, and it arrives with no parts at
// all — the reason sits in `promptFeedback.blockReason` or the candidate's `finishReason`. Reading
// only the text parts there leaves the caller billed for the earlier candidates and told nothing.
function describe_failure(response: ImageResponse, parts: ReadonlyArray<Part>): string {
	const reasons = [response.promptFeedback?.blockReason, response.candidates?.[0]?.finishReason]
	const stated = reasons.filter((reason) => reason !== undefined && reason !== '')
	const text = describe_text_parts(parts)

	return stated.length === 0 ? text : `${stated.join(', ')} — ${text}`
}

// Pulls the first inline image out of a response. A response carrying only text is the refusal
// case — a safety block, or the model answering in prose — so it fails with whatever it said
// instead of writing an empty file.
function response_parts(response: ImageResponse): ReadonlyArray<Part> {
	return response.candidates?.[0]?.content?.parts ?? []
}

function first_image(response: ImageResponse): CoverImage {
	const parts = response_parts(response)
	const inline = parts.map((part) => part.inlineData).find((data) => data?.data !== undefined)

	if (inline?.data === undefined) {
		throw new Error(`Gemini returned no image: ${describe_failure(response, parts)}`)
	}

	return { mime_type: inline.mimeType ?? '', bytes: Buffer.from(inline.data, 'base64') }
}

async function generate_one(
	client: GoogleGenAI,
	model: string,
	prompt: string,
): Promise<CoverImage> {
	const response = await client.models.generateContent({
		model,
		contents: prompt,
		config: {
			responseModalities: [IMAGE_MODALITY],
			imageConfig: { aspectRatio: ASPECT_RATIO, imageSize: IMAGE_SIZE },
		},
	})

	return first_image(response)
}

// Sequential rather than parallel: each request is billed and rate-limited, and firing the whole
// batch at once turns one quota rejection into a failure of every candidate. Split from the client
// call so both properties can be held by a test without a billed request — `count` requests exactly,
// and never two in flight.
async function generate_sequentially(
	generate_candidate: (index: number) => Promise<CoverImage>,
	count: number,
	on_image: (image: CoverImage) => void,
): Promise<void> {
	for (let index = 0; index < count; index += 1) on_image(await generate_candidate(index))
}

async function generate_with_gemini(
	config: CoverConfig,
	prompt: string,
	count: number,
	on_image: (image: CoverImage) => void,
): Promise<void> {
	const client = new GoogleGenAI({ apiKey: config.api_key })

	async function generate_candidate(index: number): Promise<CoverImage> {
		console.info(`Generating candidate ${String(index + 1)}/${String(count)} (${config.model})...`)

		return await generate_one(client, config.model, prompt)
	}

	await generate_sequentially(generate_candidate, count, on_image)
}

function write_image(output_path: string, bytes: Uint8Array): void {
	mkdirSync(path.dirname(output_path), { recursive: true })
	writeFileSync(output_path, bytes)
}

function build_dependencies(config: CoverConfig): CoverDependencies {
	return {
		read_post(post_path: string): string {
			return readFileSync(post_path, 'utf8')
		},
		read_prompt(): string {
			return readFileSync(config.prompt_path, 'utf8')
		},
		async generate(
			prompt: string,
			count: number,
			on_image: (image: CoverImage) => void,
		): Promise<void> {
			await generate_with_gemini(config, prompt, count, on_image)
		},
		write_image,
	}
}

// Each candidate is written and announced the moment it arrives, so a failure partway through a
// batch leaves the earlier — already billed — images on disk and names them on the console.
function save_candidate(
	dependencies: CoverDependencies,
	slug: string,
	run_stamp: string,
	written: Array<string>,
): (image: CoverImage) => void {
	return (image: CoverImage): void => {
		const output_path = resolve_output_path(slug, run_stamp, written.length, image.mime_type)

		dependencies.write_image(output_path, image.bytes)
		written.push(output_path)
		console.info(`  wrote ${output_path}`)
	}
}

async function run(
	dependencies: CoverDependencies,
	slug_or_path: string,
	count: number,
	now: Date,
): Promise<ReadonlyArray<string>> {
	const post_path = blog_post_source.resolve_post_path(slug_or_path)
	const post = blog_post_source.read_summary(
		post_path,
		dependencies.read_post(post_path),
		BODY_CHARACTER_LIMIT,
	)
	const prompt = build_prompt(dependencies.read_prompt(), post)
	const written: Array<string> = []
	const stamp = blog_cover_assets.format_run_stamp(now)
	const on_image = save_candidate(dependencies, post.slug, stamp, written)

	await dependencies.generate(prompt, count, on_image)

	return written
}

function report(written: ReadonlyArray<string>): void {
	console.info(`Wrote ${String(written.length)} candidate(s):`)

	for (const output_path of written) console.info(`  ${output_path}`)

	console.info(`Copy the one you pick into ${BLOG_IMAGES_DIR}; this command never writes there.`)
}

// Arguments are read before the environment so a bare `pnpm blog:cover` answers with the usage
// line rather than with a missing-key error that points at the wrong problem.
async function main(args: ReadonlyArray<string>, now: Date): Promise<void> {
	const { value: slug_or_path, rest } = cli.read_argument_with_rest(
		args,
		COVER_USAGE,
		COUNT_ARGUMENT_MAX,
	)
	const count = parse_count(rest[0])
	const dependencies = build_dependencies(read_config())

	report(await run(dependencies, slug_or_path, count, now))
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

const blog_cover_image = {
	DEFAULT_IMAGE_COUNT,
	MAX_IMAGE_COUNT,
	read_config,
	build_prompt,
	parse_count,
	extension_for_image,
	resolve_output_path,
	first_image,
	generate_sequentially,
	build_dependencies,
	run,
	main,
}

export type { CoverConfig, CoverDependencies, CoverImage, ImageResponse }
export { blog_cover_image }
