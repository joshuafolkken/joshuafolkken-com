#!/usr/bin/env tsx
/**
 * Inject deterministic YouTube metadata into a talk-derived article's frontmatter.
 *
 * The `prompts/audio-to-article-4.md` prompt emits placeholder tokens for the
 * fields the summarizing LLM cannot know reliably (it cannot browse YouTube):
 *   date          -> {{PUBLISH_DATE}}  (this script's run date = the article's publish date, YYYY-MM-DD)
 *   youtube       -> {{YOUTUBE_URL}}   (https://www.youtube.com/watch?v=<id>)
 *   youtube_date  -> {{YOUTUBE_DATE}}  (the day the stream went out, YYYY-MM-DD in JST — see resolve_broadcast_date)
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
const MILLISECONDS_PER_SECOND = 1000

// The stream's own timezone. Broadcasts start in the evening JST, so a JST calendar date names the
// session the way the host and viewers experienced it. Read through `formatToParts` rather than the
// formatted string: the field order of any locale's short date is a CLDR pattern, not a contract,
// and a silent change to it would put slashes into a post filename.
const BROADCAST_DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
	timeZone: 'Asia/Tokyo',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
})

interface VideoMetadata {
	video_id: string
	upload_date: string
	// The day the stream actually went out, YYYY-MM-DD in JST. Drives both the post filename and
	// the `youtube_date` frontmatter, so the two can never disagree.
	broadcast_date: string
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
	release_timestamp?: unknown
	timestamp?: unknown
	title?: unknown
}

// yt-dlp `upload_date` is a bare YYYYMMDD; the blog frontmatter uses YYYY-MM-DD.
function format_upload_date(upload_date: string): string {
	if (!UPLOAD_DATE_PATTERN.test(upload_date)) {
		throw new TypeError(`Invalid yt-dlp upload_date: ${upload_date}`)
	}

	return upload_date.replace(UPLOAD_DATE_PATTERN, '$1-$2-$3')
}

// Assembles YYYY-MM-DD from the named parts, so the output shape is ours rather than the locale's.
function format_jst_date(instant: Date): string {
	const parts = new Map(
		BROADCAST_DATE_FORMAT.formatToParts(instant).map(({ type, value }) => [type, value]),
	)

	const year = parts.get('year')
	const month = parts.get('month')
	const day = parts.get('day')

	// Bailing out beats emitting `-07-28`, which would become a post filename and a frontmatter date.
	if (year === undefined || month === undefined || day === undefined) {
		throw new TypeError(`Cannot read a JST date from: ${instant.toISOString()}`)
	}

	return `${year}-${month}-${day}`
}

// Picks the day the stream went out, in JST. `upload_date` is the archive's publish day in UTC,
// which rolls to the next day whenever YouTube finishes processing after 09:00 JST — that is how
// a 2026-07-28 evening broadcast was filed as 2026-07-29. `release_timestamp` is the broadcast
// start and wins; `timestamp` covers a normal (non-live) upload; the bare `upload_date` is the
// last resort, and the only one carrying no time of day to convert.
function resolve_broadcast_date(
	release_timestamp: unknown,
	timestamp: unknown,
	upload_date: string,
): string {
	const seconds = typeof release_timestamp === 'number' ? release_timestamp : timestamp

	if (typeof seconds !== 'number') return format_upload_date(upload_date)

	return format_jst_date(new Date(seconds * MILLISECONDS_PER_SECOND))
}

// Extracts id + dates + title from a yt-dlp `--write-info-json` payload, rejecting a payload
// missing any required field so a partial download never yields a blank frontmatter.
function parse_info_json(raw: string): VideoMetadata {
	const parsed = JSON.parse(raw) as RawInfoJson
	const { id, upload_date, title, release_timestamp, timestamp } = parsed

	if (typeof id !== 'string' || typeof upload_date !== 'string' || typeof title !== 'string') {
		throw new TypeError('info.json is missing a string id, upload_date, or title')
	}

	return {
		video_id: id,
		upload_date,
		broadcast_date: resolve_broadcast_date(release_timestamp, timestamp, upload_date),
		video_title: title,
	}
}

// The frontmatter wraps the title in a YAML single-quoted scalar; the only character that
// needs escaping there is the single quote itself, which YAML represents by doubling it.
function escape_yaml_single_quoted(value: string): string {
	return value.replaceAll("'", "''")
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
		youtube_date: metadata.broadcast_date,
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
	resolve_broadcast_date,
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
