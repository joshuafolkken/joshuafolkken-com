#!/usr/bin/env tsx
/**
 * Inject deterministic YouTube metadata into a talk-derived article's frontmatter.
 *
 * The `prompts/audio-to-article-2.md` prompt emits placeholder tokens for the three
 * fields the summarizing LLM cannot know reliably (it cannot browse YouTube):
 *   date    -> {{PUBLISH_DATE}}   (yt-dlp `upload_date`, formatted YYYY-MM-DD)
 *   updated -> {{GENERATED_DATE}} (this script's run date, YYYY-MM-DD)
 *   youtube -> {{YOUTUBE_URL}}    (https://www.youtube.com/watch?v=<id>)
 * This post-processor replaces those tokens with values read from the `.info.json`
 * that `pnpm yt:mp3` writes alongside the audio, so the values are never fabricated.
 *
 * Usage:
 *   pnpm article:frontmatter <article.md> <youtube-url-or-id>
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { youtube } from '$lib/utils/youtube'

const AUDIO_DIR = '.audio'
const INFO_JSON_SUFFIX = '.info.json'
const WATCH_URL_BASE = 'https://www.youtube.com/watch?v='
const UPLOAD_DATE_PATTERN = /^(\d{4})(\d{2})(\d{2})$/u
const BARE_ID_PATTERN = /^[\w-]{11}$/u
const DATE_PAD_WIDTH = 2
const CLI_ARGS_START = 2

interface VideoMetadata {
	video_id: string
	upload_date: string
}

interface FrontmatterValues {
	publish_date: string
	generated_date: string
	youtube_url: string
}

interface RawInfoJson {
	id?: unknown
	upload_date?: unknown
}

// Extracts id + upload_date from a yt-dlp `--write-info-json` payload, rejecting a
// payload missing either field so a partial download never yields a blank frontmatter.
function parse_info_json(raw: string): VideoMetadata {
	const parsed = JSON.parse(raw) as RawInfoJson
	const { id, upload_date } = parsed

	if (typeof id !== 'string' || typeof upload_date !== 'string') {
		throw new TypeError('info.json is missing a string id or upload_date')
	}

	return { video_id: id, upload_date }
}

// yt-dlp `upload_date` is a bare YYYYMMDD; the blog frontmatter uses YYYY-MM-DD.
function format_upload_date(upload_date: string): string {
	if (!UPLOAD_DATE_PATTERN.test(upload_date)) {
		throw new TypeError(`Invalid yt-dlp upload_date: ${upload_date}`)
	}

	return upload_date.replace(UPLOAD_DATE_PATTERN, '$1-$2-$3')
}

function format_generated_date(now: Date): string {
	const year = String(now.getFullYear())
	const month = String(now.getMonth() + 1).padStart(DATE_PAD_WIDTH, '0')
	const day = String(now.getDate()).padStart(DATE_PAD_WIDTH, '0')

	return `${year}-${month}-${day}`
}

function build_youtube_url(video_id: string): string {
	if (!video_id) throw new Error('Cannot build a YouTube URL from an empty video id')

	return `${WATCH_URL_BASE}${video_id}`
}

function resolve_video_id(url_or_id: string): string {
	if (BARE_ID_PATTERN.test(url_or_id)) return url_or_id

	const from_url = youtube.get_video_id(url_or_id)
	if (!from_url) throw new Error(`Cannot resolve a YouTube video id from: ${url_or_id}`)

	return from_url
}

// Matches a token wrapped in any of the sentinel forms the model may emit: the intended
// `{{X}}`, or the Markdown-bold variants `__X__` / `**X**` a stray conversion can produce.
function placeholder_pattern(token: string): RegExp {
	return new RegExp(String.raw`(?:\{\{|__|\*\*)${token}(?:\}\}|__|\*\*)`, 'gu')
}

function inject_frontmatter_metadata(markdown: string, values: FrontmatterValues): string {
	return markdown
		.replace(placeholder_pattern('PUBLISH_DATE'), () => values.publish_date)
		.replace(placeholder_pattern('GENERATED_DATE'), () => values.generated_date)
		.replace(placeholder_pattern('YOUTUBE_URL'), () => values.youtube_url)
}

function find_info_metadata(audio_directory: string, video_id: string): VideoMetadata {
	const files = readdirSync(audio_directory).filter((name) => name.endsWith(INFO_JSON_SUFFIX))

	for (const name of files) {
		const metadata = parse_info_json(readFileSync(path.join(audio_directory, name), 'utf8'))
		if (metadata.video_id === video_id) return metadata
	}

	throw new Error(`No ${INFO_JSON_SUFFIX} with id ${video_id} in ${audio_directory}`)
}

function build_values(metadata: VideoMetadata, now: Date): FrontmatterValues {
	return {
		youtube_url: build_youtube_url(metadata.video_id),
		publish_date: format_upload_date(metadata.upload_date),
		generated_date: format_generated_date(now),
	}
}

function read_cli_arguments(args: ReadonlyArray<string>): {
	article_path: string
	url_or_id: string
} {
	const [article_path, url_or_id] = args

	if (!article_path || !url_or_id) {
		throw new Error('Usage: pnpm article:frontmatter <article.md> <youtube-url-or-id>')
	}

	return { article_path, url_or_id }
}

function main(args: ReadonlyArray<string>, now: Date): void {
	const { article_path, url_or_id } = read_cli_arguments(args)
	const video_id = resolve_video_id(url_or_id)
	const metadata = find_info_metadata(AUDIO_DIR, video_id)
	const values = build_values(metadata, now)
	const injected = inject_frontmatter_metadata(readFileSync(article_path, 'utf8'), values)

	writeFileSync(article_path, injected)
	console.info(`Injected metadata into ${article_path}: ${JSON.stringify(values)}`)
}

const is_main_module = import.meta.url === `file://${process.argv[1] ?? ''}`

if (is_main_module) {
	try {
		main(process.argv.slice(CLI_ARGS_START), new Date())
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

const talk_frontmatter = {
	parse_info_json,
	format_upload_date,
	format_generated_date,
	build_youtube_url,
	resolve_video_id,
	inject_frontmatter_metadata,
	find_info_metadata,
	main,
}

export type { FrontmatterValues, VideoMetadata }
export { talk_frontmatter }
