#!/usr/bin/env tsx
/**
 * One-shot pipeline: a YouTube URL becomes a ready-to-review talk article.
 *
 * Downloads the audio (reusing `pnpm yt:audio`, the single source of the yt-dlp flags),
 * then generates the article (reusing `audio-to-article`). If the audio + info.json are
 * already present in `.audio/`, the download is skipped and only the post is (re)generated.
 * An existing post file is overwritten.
 *
 * Usage:
 *   pnpm yt:talk '<youtube-url-or-id>'
 *
 * Required/optional env: same as `pnpm yt:article` (GEMINI_API_KEY, GEMINI_MODEL, ...).
 */
import { spawnSync } from 'node:child_process'
import { audio_to_article } from './audio-to-article'
import { cli } from './cli'
import { environment } from './environment'
import { talk_frontmatter } from './inject-talk-frontmatter'
import { preview } from './preview'

const AUDIO_DIR = '.audio'
const CLI_ARGS_START = 2
const USAGE = 'Usage: pnpm yt:talk <youtube-url-or-id>'
const DOWNLOAD_ARGS = ['run', 'yt:audio']

interface TalkResult {
	output_path: string
	did_download: boolean
}

interface TalkDependencies {
	is_audio_present: (video_id: string) => boolean
	download_audio: (url: string) => void
	generate: (url_or_id: string, now: Date) => Promise<string>
}

// Treats a successful lookup as "present" and any lookup error (missing info.json or missing
// sibling audio) as "absent", so a partial download re-triggers a fresh download.
function is_audio_available(find: (video_id: string) => unknown, video_id: string): boolean {
	try {
		find(video_id)

		return true
	} catch {
		return false
	}
}

async function run_talk(
	dependencies: TalkDependencies,
	url_or_id: string,
	now: Date,
): Promise<TalkResult> {
	const video_id = talk_frontmatter.resolve_video_id(url_or_id)
	const is_present = dependencies.is_audio_present(video_id)

	if (is_present) {
		console.info(`Audio for ${video_id} already present in ${AUDIO_DIR}; skipping download.`)
	} else {
		dependencies.download_audio(talk_frontmatter.build_youtube_url(video_id))
	}

	const output_path = await dependencies.generate(url_or_id, now)

	return { output_path, did_download: !is_present }
}

// Reuses `pnpm yt:audio` (the single source of the yt-dlp flags) rather than re-listing them.
// Invokes it through the absolute node binary and pnpm's own path (npm_execpath) instead of a
// bare `pnpm`, so the spawn never depends on a PATH lookup (Sonar S4036).
function download_audio(url: string): void {
	const pnpm_path = environment.read_environment('npm_execpath')

	if (pnpm_path === undefined || pnpm_path === '') {
		throw new Error('npm_execpath is not set; run this via `pnpm yt:talk`')
	}

	const result = spawnSync(process.execPath, [pnpm_path, ...DOWNLOAD_ARGS, url], {
		stdio: 'inherit',
	})

	if (result.status !== 0) {
		throw new Error(`Audio download failed: pnpm yt:audio exited with ${String(result.status)}`)
	}
}

function build_talk_dependencies(): TalkDependencies {
	const config = audio_to_article.read_config()

	return {
		is_audio_present(video_id: string): boolean {
			return is_audio_available((id) => audio_to_article.find_audio(AUDIO_DIR, id), video_id)
		},
		download_audio,
		async generate(url_or_id: string, now: Date): Promise<string> {
			return await audio_to_article.run(audio_to_article.build_dependencies(config), url_or_id, now)
		},
	}
}

async function main(args: ReadonlyArray<string>, now: Date): Promise<void> {
	const url_or_id = cli.read_required_argument(args, USAGE)
	const { output_path, did_download } = await run_talk(build_talk_dependencies(), url_or_id, now)
	const lead = did_download ? 'Downloaded audio and wrote' : 'Reused existing audio and wrote'

	console.info(
		`${lead} ${output_path}. Review the article and trailing 【要確認】 list before publishing.`,
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

const yt_talk = {
	is_audio_available,
	run_talk,
	download_audio,
	build_talk_dependencies,
	main,
}

export type { TalkDependencies, TalkResult }
export { yt_talk }
