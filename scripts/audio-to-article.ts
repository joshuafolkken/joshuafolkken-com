#!/usr/bin/env tsx
/**
 * Turn a downloaded talk audio into a ready-to-publish blog article via the Gemini API.
 *
 * Replaces the manual "paste the audio + prompt into AI Studio" step: it uploads the two voice
 * reference samples plus the `pnpm yt:audio` output through the Gemini File API, runs
 * `prompts/audio-to-article-4.md` over them, strips any stray Markdown fences, injects the
 * deterministic YouTube frontmatter (reusing `inject-talk-frontmatter`), and writes
 * `src/lib/posts/talk-<youtube_date>.md`.
 *
 * Requires `.audio/joshua_sample.opus` and `.audio/longinus_sample.opus` (~60s each, one speaker
 * per file) — see docs/blog-from-youtube.md for how to cut them.
 *
 * Usage:
 *   pnpm yt:audio '<youtube-url>'      # download audio first (writes .audio/*.opus + *.info.json)
 *   pnpm yt:article '<youtube-url>'    # then generate the article, with the default samples
 *   pnpm yt:article '<youtube-url>' a.opus b.opus   # override the samples, target speaker first
 *
 * Required env (see .env.example):
 *   GEMINI_API_KEY
 * Optional env:
 *   GEMINI_MODEL          (default gemini-3.5-flash)
 *   AUDIO_ARTICLE_PROMPT  (default prompts/audio-to-article-4.md)
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import {
	createPartFromUri,
	createUserContent,
	FileState,
	GoogleGenAI,
	type File as GeminiFile,
	type Part,
} from '@google/genai'
import { cli, type PositionalInput } from './cli'
import { environment } from './environment'
import { talk_frontmatter, type VideoMetadata } from './inject-talk-frontmatter'
import { preview } from './preview'

const AUDIO_DIR = '.audio'
const POSTS_DIR = 'src/lib/posts'
const INFO_JSON_SUFFIX = '.info.json'
const DEFAULT_MODEL = 'gemini-3.5-flash'
const DEFAULT_PROMPT_PATH = 'prompts/audio-to-article-4.md'
const DEFAULT_AUDIO_MIME = 'audio/ogg'
const CLI_ARGS_START = 2
const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 90
const STREAM_PROGRESS_CHUNKS = 20
const ARTICLE_USAGE =
	'Usage: pnpm yt:article <youtube-url-or-id> [target-speaker-sample] [excluded-speaker-sample]'

// Voice samples uploaded ahead of the talk audio so the model matches every utterance against a
// known anchor instead of clustering the speakers itself — self-anchoring over a multi-hour stream
// is what let a co-host's topics land in the article as Joshua's own. The order is part of the
// contract: `prompts/audio-to-article-*.md` refers to these by position, target speaker first.
const REFERENCE_SAMPLES: ReadonlyArray<readonly [string, string]> = [
	['joshua_sample.opus', 'reference-target-speaker'],
	['longinus_sample.opus', 'reference-excluded-speaker'],
]

// How many trailing sample paths either command reads. Shared so `yt:talk` rejects a stray extra
// argument on the same terms as `yt:article` instead of dropping it.
const REFERENCE_SAMPLE_COUNT = REFERENCE_SAMPLES.length

// Maps the audio container `pnpm yt:audio` (and common fallbacks) can produce to a MIME type
// Gemini accepts, keyed by the extension without its leading dot. Opus lives in an Ogg
// container, so `opus` -> `audio/ogg`.
const AUDIO_MIME_BY_EXTENSION: Readonly<Record<string, string>> = {
	opus: 'audio/ogg',
	ogg: 'audio/ogg',
	mp3: 'audio/mpeg',
	m4a: 'audio/mp4',
	aac: 'audio/aac',
	wav: 'audio/wav',
	flac: 'audio/flac',
}

// Unwraps a whole-output ```lang ... ``` fence the model sometimes adds despite the prompt asking
// for the article only. Anchored to the full string, so code fences *inside* the article (and the
// leading `---` frontmatter, which is never a fence) are left untouched.
const WHOLE_OUTPUT_FENCE = /^\s*```[\w-]*\n([\s\S]*?)\n```\s*$/u

interface ArticleConfig {
	api_key: string
	model: string
	prompt_path: string
}

interface AudioSource {
	audio_path: string
	mime_type: string
	// ASCII label for the File API metadata. Kept separate from `audio_path` because yt-dlp
	// filenames carry non-ASCII characters that must never reach an HTTP header (see build_upload_request).
	display_name: string
}

interface UploadRequest {
	file: Blob
	config: { mimeType: string; displayName: string }
}

// The slice of a streamed response this script needs, kept structural so a test can feed a plain
// async generator instead of building SDK response objects.
interface TextChunk {
	text?: string | undefined
}

interface ArticleDependencies {
	find_metadata: (video_id: string) => VideoMetadata
	find_audio: (video_id: string) => AudioSource
	find_references: () => ReadonlyArray<AudioSource>
	read_prompt: () => string
	generate: (sources: ReadonlyArray<AudioSource>, prompt: string) => Promise<string>
	write_article: (output_path: string, content: string) => void
}

function read_config(): ArticleConfig {
	return {
		api_key: environment.require_environment('GEMINI_API_KEY'),
		model: environment.optional_environment('GEMINI_MODEL', DEFAULT_MODEL),
		prompt_path: environment.optional_environment('AUDIO_ARTICLE_PROMPT', DEFAULT_PROMPT_PATH),
	}
}

function mime_for_audio(filename: string): string {
	const extension = path.extname(filename).toLowerCase().slice(1)

	return AUDIO_MIME_BY_EXTENSION[extension] ?? DEFAULT_AUDIO_MIME
}

// Picks the audio file that shares the info.json's base name (yt-dlp writes `<base>.opus`
// alongside `<base>.info.json`), rejecting a base whose audio was deleted or never downloaded.
function select_audio_file(files: ReadonlyArray<string>, info_basename: string): string {
	const match = files.find(
		(name) =>
			name !== `${info_basename}${INFO_JSON_SUFFIX}` && name.startsWith(`${info_basename}.`),
	)

	if (match === undefined) {
		throw new Error(`No audio file for "${info_basename}" in ${AUDIO_DIR}; run pnpm yt:audio first`)
	}

	return match
}

// Resolves the audio path by matching the video id against each `.info.json` in the directory,
// then locating that entry's sibling audio file.
function find_audio(directory: string, video_id: string): AudioSource {
	const files = readdirSync(directory)
	const info_files = files.filter((entry) => entry.endsWith(INFO_JSON_SUFFIX))

	for (const name of info_files) {
		const metadata = talk_frontmatter.parse_info_json(
			readFileSync(path.join(directory, name), 'utf8'),
		)
		if (metadata.video_id !== video_id) continue

		const info_basename = name.slice(0, -INFO_JSON_SUFFIX.length)
		const audio_name = select_audio_file(files, info_basename)

		return {
			audio_path: path.join(directory, audio_name),
			mime_type: mime_for_audio(audio_name),
			display_name: video_id,
		}
	}

	throw new Error(`No ${INFO_JSON_SUFFIX} with id ${video_id} in ${directory}`)
}

// Resolves the voice samples, taking `overrides` positionally (target speaker first) and falling
// back to the fixed name in `directory` for each position left unspecified. Missing files fail
// loudly: a silent fallback to "no references" would restore the old self-anchoring behavior
// without any visible signal, which is exactly the misattribution this guards against.
function find_reference_samples(
	directory: string,
	overrides: ReadonlyArray<string> = [],
): ReadonlyArray<AudioSource> {
	return REFERENCE_SAMPLES.map(([filename, display_name], index) => {
		const audio_path = overrides[index] ?? path.join(directory, filename)

		if (!existsSync(audio_path)) {
			throw new Error(
				`Missing reference sample ${audio_path}; see docs/blog-from-youtube.md for how to cut one`,
			)
		}

		return { audio_path, mime_type: mime_for_audio(audio_path), display_name }
	})
}

function resolve_output_path(youtube_date: string): string {
	return path.join(POSTS_DIR, `talk-${youtube_date}.md`)
}

function strip_code_fences(text: string): string {
	const inner = WHOLE_OUTPUT_FENCE.exec(text)?.[1]

	return inner ?? text.trim()
}

// Combines the raw model output into a publishable article: drop any wrapping fence, then fill the
// deterministic date/URL frontmatter placeholders from the video metadata (single-sourced logic).
function assemble_article(raw_output: string, metadata: VideoMetadata, now: Date): string {
	const stripped = strip_code_fences(raw_output)
	const values = talk_frontmatter.build_values(metadata, now)

	return talk_frontmatter.inject_frontmatter_metadata(stripped, values)
}

async function run(
	dependencies: ArticleDependencies,
	url_or_id: string,
	now: Date,
): Promise<string> {
	const video_id = talk_frontmatter.resolve_video_id(url_or_id)
	const metadata = dependencies.find_metadata(video_id)
	// References lead so the model fixes both voice anchors before it hears the talk itself.
	const sources = [...dependencies.find_references(), dependencies.find_audio(video_id)]
	const raw_output = await dependencies.generate(sources, dependencies.read_prompt())
	const article = assemble_article(raw_output, metadata, now)
	const output_path = resolve_output_path(metadata.broadcast_date)

	dependencies.write_article(output_path, article)

	return output_path
}

// Re-fetches the file's current state, rejecting a payload the File API returned without a name.
async function refresh_file(client: GoogleGenAI, current: GeminiFile): Promise<GeminiFile> {
	const { name } = current

	if (name === undefined) throw new Error('Uploaded file is missing a name')

	return await client.files.get({ name })
}

// The File API keeps an upload in PROCESSING until the audio is decoded; it must reach ACTIVE
// before generateContent can reference it. Poll until it settles, failing on FAILED or timeout.
async function wait_until_active(client: GoogleGenAI, uploaded: GeminiFile): Promise<GeminiFile> {
	let current = uploaded
	let attempt = 0

	while (current.state === FileState.PROCESSING) {
		if (attempt >= MAX_POLL_ATTEMPTS) throw new Error('Timed out waiting for the audio to process')

		await sleep(POLL_INTERVAL_MS)
		current = await refresh_file(client, current)
		attempt += 1
	}

	if (current.state !== FileState.ACTIVE) {
		throw new Error(`Audio processing failed with state: ${String(current.state)}`)
	}

	return current
}

// Builds the File API upload params from the audio bytes. Uploading a Blob (not the path string)
// is deliberate: the SDK only sets the latin1-only `X-Goog-Upload-File-Name` header for string
// inputs, so a Blob keeps yt-dlp's non-ASCII (Japanese, emoji) filenames out of HTTP headers.
function build_upload_request(source: AudioSource, bytes: Uint8Array): UploadRequest {
	// Re-wrap into a fresh ArrayBuffer-backed view: Node's readFileSync returns a Buffer typed
	// as Uint8Array<ArrayBufferLike>, which is not assignable to the DOM Blob's BlobPart.
	const part = new Uint8Array(bytes)

	return {
		file: new Blob([part], { type: source.mime_type }),
		config: { mimeType: source.mime_type, displayName: source.display_name },
	}
}

async function upload_active_audio(client: GoogleGenAI, source: AudioSource): Promise<GeminiFile> {
	console.info(`Uploading ${source.audio_path} (${source.mime_type}) to the Gemini File API...`)
	const request = build_upload_request(source, readFileSync(source.audio_path))
	const uploaded = await client.files.upload(request)

	return await wait_until_active(client, uploaded)
}

async function upload_audio_part(client: GoogleGenAI, source: AudioSource): Promise<Part> {
	const active = await upload_active_audio(client, source)

	if (active.uri === undefined || active.mimeType === undefined) {
		throw new Error('Uploaded file is missing a uri or mimeType')
	}

	return createPartFromUri(active.uri, active.mimeType)
}

// Joins a streamed generation into the full article, reporting progress as it goes.
async function collect_stream_text(
	stream: AsyncIterable<TextChunk>,
	on_progress: (characters: number, chunk_index: number) => void,
): Promise<string> {
	const parts: Array<string> = []
	let characters = 0

	for await (const chunk of stream) {
		const { text } = chunk

		if (text === undefined || text === '') continue

		parts.push(text)
		characters += text.length
		on_progress(characters, parts.length)
	}

	return parts.join('')
}

function report_stream_progress(characters: number, chunk_index: number): void {
	if (chunk_index % STREAM_PROGRESS_CHUNKS !== 0) return

	console.info(`  received ${String(characters)} characters so far...`)
}

// Streams rather than awaiting the whole generation: a non-streaming call only sends its response
// headers once the article is finished, so anything past undici's 300s headersTimeout dies with
// UND_ERR_HEADERS_TIMEOUT — reachable on a multi-hour stream. That limit cannot be raised through
// the SDK (its `httpOptions.timeout` only aborts earlier), but streaming returns headers up front.
async function generate_with_gemini(
	config: ArticleConfig,
	sources: ReadonlyArray<AudioSource>,
	prompt: string,
): Promise<string> {
	const client = new GoogleGenAI({ apiKey: config.api_key })
	// Parts keep `sources` order, which is the contract the prompt reads the audio by.
	const parts = await Promise.all(
		sources.map(async (source) => await upload_audio_part(client, source)),
	)

	console.info(`Generating the article with ${config.model} (this can take a few minutes)...`)
	const stream = await client.models.generateContentStream({
		model: config.model,
		contents: createUserContent([...parts, prompt]),
	})
	const text = await collect_stream_text(stream, report_stream_progress)

	if (text === '') throw new Error('Gemini returned an empty response')

	return text
}

function build_dependencies(
	config: ArticleConfig,
	reference_paths: ReadonlyArray<string> = [],
): ArticleDependencies {
	return {
		find_metadata(video_id: string): VideoMetadata {
			return talk_frontmatter.find_info_metadata(AUDIO_DIR, video_id)
		},
		find_audio(video_id: string): AudioSource {
			return find_audio(AUDIO_DIR, video_id)
		},
		find_references(): ReadonlyArray<AudioSource> {
			return find_reference_samples(AUDIO_DIR, reference_paths)
		},
		read_prompt(): string {
			return readFileSync(config.prompt_path, 'utf8')
		},
		async generate(sources: ReadonlyArray<AudioSource>, prompt: string): Promise<string> {
			return await generate_with_gemini(config, sources, prompt)
		},
		write_article(output_path: string, content: string): void {
			writeFileSync(output_path, content)
		},
	}
}

function read_cli_input(args: ReadonlyArray<string>): PositionalInput {
	return cli.read_argument_with_rest(args, ARTICLE_USAGE, REFERENCE_SAMPLE_COUNT)
}

async function main(args: ReadonlyArray<string>, now: Date): Promise<void> {
	const config = read_config()
	const { value: url_or_id, rest: reference_paths } = read_cli_input(args)
	const output_path = await run(build_dependencies(config, reference_paths), url_or_id, now)

	console.info(
		`Wrote ${output_path}. Review the article and the trailing 【要確認】 list before publishing.`,
	)
	preview.open_post_preview(output_path)
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

const audio_to_article = {
	REFERENCE_SAMPLE_COUNT,
	read_config,
	mime_for_audio,
	select_audio_file,
	find_audio,
	find_reference_samples,
	resolve_output_path,
	collect_stream_text,
	strip_code_fences,
	assemble_article,
	build_upload_request,
	run,
	build_dependencies,
	read_cli_input,
	main,
}

export type { ArticleConfig, ArticleDependencies, AudioSource, UploadRequest }
export { audio_to_article }
