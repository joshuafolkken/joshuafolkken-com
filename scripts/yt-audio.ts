#!/usr/bin/env tsx
/**
 * Downloads a YouTube URL's audio as opus into `.audio/`, reusing the shared opus
 * encoding quality (`opus-encoding`) so the bitrate/codec live in exactly one place
 * rather than inlined in the package.json script string.
 *
 * Usage:
 *   pnpm yt:audio '<youtube-url-or-id>'
 */
import { spawnSync } from 'node:child_process'
import { opus_encoding } from './opus-encoding'

const CLI_ARGS_START = 2
const AUDIO_DIR = '.audio'
const YT_DLP_BINARY = 'yt-dlp'

interface SpawnResult {
	status: number | null
	error?: Error
}

type SpawnRunner = (binary: string, args: ReadonlyArray<string>) => SpawnResult

// yt-dlp flags that stay constant; the opus quality comes from the shared source and any
// caller-supplied arguments (the URL) are appended verbatim.
function build_yt_dlp_args(extra_args: ReadonlyArray<string>): ReadonlyArray<string> {
	return [
		'-x',
		'--audio-format',
		'opus',
		'-P',
		AUDIO_DIR,
		'--cookies-from-browser',
		'chrome',
		'--write-info-json',
		'--postprocessor-args',
		opus_encoding.build_yt_dlp_postprocessor_args(),
		...extra_args,
	]
}

function default_spawn(binary: string, args: ReadonlyArray<string>): SpawnResult {
	const result = spawnSync(binary, [...args], { stdio: 'inherit' })

	if (result.error !== undefined) return { status: result.status, error: result.error }

	return { status: result.status }
}

function run_yt_dlp(spawn: SpawnRunner, extra_args: ReadonlyArray<string>): void {
	const result = spawn(YT_DLP_BINARY, build_yt_dlp_args(extra_args))

	if (result.error !== undefined) throw new Error(`yt-dlp failed: ${result.error.message}`)

	if (result.status !== 0) throw new Error(`yt-dlp exited with ${String(result.status)}`)
}

function main(args: ReadonlyArray<string>): void {
	run_yt_dlp(default_spawn, args)
}

const is_main_module = import.meta.url === `file://${process.argv[1] ?? ''}`

if (is_main_module) {
	try {
		main(process.argv.slice(CLI_ARGS_START))
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

const yt_audio = {
	build_yt_dlp_args,
	default_spawn,
	run_yt_dlp,
	main,
}

export type { SpawnResult, SpawnRunner }
export { yt_audio }
