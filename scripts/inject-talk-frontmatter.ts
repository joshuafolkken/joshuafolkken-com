#!/usr/bin/env tsx
/**
 * Inject deterministic YouTube metadata into a talk-derived article's frontmatter.
 *
 * The `prompts/audio-to-article-3.md` prompt emits placeholder tokens for the
 * fields the summarizing LLM cannot know reliably (it cannot browse YouTube):
 *   date          -> {{PUBLISH_DATE}}  (this script's run date = the article's publish date, YYYY-MM-DD)
 *   youtube       -> {{YOUTUBE_URL}}   (https://www.youtube.com/watch?v=<id>)
 *   youtube_date  -> {{YOUTUBE_DATE}}  (yt-dlp `upload_date` = the video's original publish date, YYYY-MM-DD)
 *   youtube_title -> {{YOUTUBE_TITLE}} (yt-dlp `title` = the original video title)
 * This post-processor replaces those tokens with values read from the `.info.json`
 * that `pnpm yt:audio` writes alongside the audio, so the values are never fabricated.
 *
 * Usage:
 *   pnpm article:frontmatter <article.md> <youtube-url-or-id>
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { youtube } from '$lib/utils/youtube'

const AUDIO_DIR = '.audio'
const POSTS_DIR = 'src/lib/posts'
const INFO_JSON_SUFFIX = '.info.json'
const WATCH_URL_BASE = 'https://www.youtube.com/watch?v='
const UPLOAD_DATE_PATTERN = /^(\d{4})(\d{2})(\d{2})$/u
const BARE_ID_PATTERN = /^[\w-]{11}$/u
const DATE_PAD_WIDTH = 2
const CLI_ARGS_START = 2

interface VideoMetadata {
	video_id: string
	upload_date: string
	video_title: string
}

interface FrontmatterValues {
	article_date: string
	youtube_date: string
	youtube_url: string
	youtube_title: string
}

interface RawInfoJson {
	id?: unknown
	upload_date?: unknown
	title?: unknown
}

// Extracts id + upload_date + title from a yt-dlp `--write-info-json` payload, rejecting a
// payload missing any field so a partial download never yields a blank frontmatter.
function parse_info_json(raw: string): VideoMetadata {
	const parsed = JSON.parse(raw) as RawInfoJson
	const { id, upload_date, title } = parsed

	if (typeof id !== 'string' || typeof upload_date !== 'string' || typeof title !== 'string') {
		throw new TypeError('info.json is missing a string id, upload_date, or title')
	}

	return { video_id: id, upload_date, video_title: title }
}

// The frontmatter wraps the title in a YAML single-quoted scalar; the only character that
// needs escaping there is the single quote itself, which YAML represents by doubling it.
function escape_yaml_single_quoted(value: string): string {
	return value.replaceAll("'", "''")
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
		.replace(placeholder_pattern('PUBLISH_DATE'), () => values.article_date)
		.replace(placeholder_pattern('YOUTUBE_DATE'), () => values.youtube_date)
		.replace(placeholder_pattern('YOUTUBE_URL'), () => values.youtube_url)
		.replace(placeholder_pattern('YOUTUBE_TITLE'), () => values.youtube_title)
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
		youtube_date: format_upload_date(metadata.upload_date),
		youtube_title: escape_yaml_single_quoted(metadata.video_title),
		article_date: format_generated_date(now),
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

// A bare filename (no directory part) is resolved under the posts directory so callers can
// pass just `talk-2026-01-22.md`; an explicit relative or absolute path is used as given.
function resolve_article_path(article_argument: string): string {
	if (path.dirname(article_argument) === '.') return path.join(POSTS_DIR, article_argument)

	return article_argument
}

function main(args: ReadonlyArray<string>, now: Date): void {
	const { article_path: article_argument, url_or_id } = read_cli_arguments(args)
	const article_path = resolve_article_path(article_argument)
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
	escape_yaml_single_quoted,
	format_upload_date,
	format_generated_date,
	build_youtube_url,
	resolve_video_id,
	resolve_article_path,
	inject_frontmatter_metadata,
	build_values,
	find_info_metadata,
	main,
}

export type { FrontmatterValues, VideoMetadata }
export { talk_frontmatter }
