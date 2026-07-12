#!/usr/bin/env tsx
/**
 * Converts audio to opus at the shared 16 kbps mono quality (`opus-encoding`, the same
 * profile `yt:audio` uses). The input path may be a single audio file or a directory of
 * mixed audio files.
 *
 * Format detection is content-based via `ffprobe`, so files whose extension is missing,
 * wrong, or mixed are still handled; a file with no decodable audio stream is skipped and
 * reported rather than crashing the run. Existing `.opus` files are left untouched so a
 * re-run never lossy-re-encodes its own output.
 *
 * Usage:
 *   pnpm audio:to-opus <file-or-directory>
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { cli } from './cli'
import { opus_encoding } from './opus-encoding'

const CLI_ARGS_START = 2
const USAGE = 'Usage: pnpm audio:to-opus <file-or-directory>'
const OPUS_EXTENSION = '.opus'
const FFPROBE_BINARY = 'ffprobe'
const FFMPEG_BINARY = 'ffmpeg'
const SKIP_ALREADY_OPUS = 'already opus'
const SKIP_NO_AUDIO = 'no decodable audio stream'
const SKIP_OUTPUT_COLLISION = 'output path already produced by another file this run'

interface FileNote {
	path: string
	reason: string
}

interface ConversionSummary {
	converted: ReadonlyArray<string>
	skipped: ReadonlyArray<FileNote>
	failed: ReadonlyArray<FileNote>
}

interface ConversionBuckets {
	converted: Array<string>
	skipped: Array<FileNote>
	failed: Array<FileNote>
	seen_outputs: Set<string>
}

interface FileSystemProbe {
	is_directory: (target: string) => boolean
	list_directory: (directory: string) => ReadonlyArray<string>
}

interface OpusConversionDependencies {
	collect_files: (input_path: string) => ReadonlyArray<string>
	has_audio_stream: (file_path: string) => boolean
	convert: (input_path: string, output_path: string) => void
}

// Resolves the input path to the list of files to consider: a directory is scanned, a lone
// file becomes a one-element list so a single audio file can be converted directly.
function resolve_inputs(probe: FileSystemProbe, input_path: string): ReadonlyArray<string> {
	if (probe.is_directory(input_path)) return probe.list_directory(input_path)

	return [input_path]
}

// Derives the sibling opus output path, replacing whatever extension the input carried.
function build_output_path(input_path: string): string {
	const directory = path.dirname(input_path)
	const base = path.basename(input_path, path.extname(input_path))

	return path.join(directory, `${base}${OPUS_EXTENSION}`)
}

function is_opus_file(file_path: string): boolean {
	return path.extname(file_path).toLowerCase() === OPUS_EXTENSION
}

function to_reason(error: unknown): string {
	return error instanceof Error ? error.message : String(error)
}

// Converts a single file, recording success or the ffmpeg failure so one bad file never
// aborts the batch (the whole point of scanning a directory of mixed, possibly-broken audio).
function convert_and_record(
	dependencies: OpusConversionDependencies,
	file_path: string,
	output_path: string,
	buckets: ConversionBuckets,
): void {
	try {
		dependencies.convert(file_path, output_path)
		buckets.converted.push(file_path)
	} catch (error) {
		buckets.failed.push({ path: file_path, reason: to_reason(error) })
	}
}

// Returns the reason this file should be skipped, or undefined when it should be converted.
// Two inputs sharing a base name (e.g. `a.aac` + `a.wav`) both map to `a.opus`, so a repeated
// output path is a collision — skipping the later ones avoids ffmpeg's `-y` silent overwrite.
function skip_reason(
	dependencies: OpusConversionDependencies,
	file_path: string,
	output_path: string,
	seen_outputs: ReadonlySet<string>,
): string | undefined {
	if (is_opus_file(file_path)) return SKIP_ALREADY_OPUS

	if (!dependencies.has_audio_stream(file_path)) return SKIP_NO_AUDIO

	if (seen_outputs.has(output_path)) return SKIP_OUTPUT_COLLISION

	return undefined
}

function classify_and_convert(
	dependencies: OpusConversionDependencies,
	file_path: string,
	buckets: ConversionBuckets,
): void {
	const output_path = build_output_path(file_path)
	const reason = skip_reason(dependencies, file_path, output_path, buckets.seen_outputs)

	if (reason !== undefined) {
		buckets.skipped.push({ path: file_path, reason })

		return
	}

	buckets.seen_outputs.add(output_path)
	convert_and_record(dependencies, file_path, output_path, buckets)
}

function run_conversion(
	dependencies: OpusConversionDependencies,
	input_path: string,
): ConversionSummary {
	const buckets: ConversionBuckets = {
		converted: [],
		skipped: [],
		failed: [],
		seen_outputs: new Set<string>(),
	}

	for (const file_path of dependencies.collect_files(input_path)) {
		classify_and_convert(dependencies, file_path, buckets)
	}

	return { converted: buckets.converted, skipped: buckets.skipped, failed: buckets.failed }
}

function is_directory(target: string): boolean {
	return fs.statSync(target).isDirectory()
}

function list_directory(directory: string): ReadonlyArray<string> {
	return fs
		.readdirSync(directory, { withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => path.join(directory, entry.name))
}

// Reports "audio" on stdout only when ffprobe finds a decodable audio stream, so the check
// is content-based rather than trusting the file extension.
function has_audio_stream(file_path: string): boolean {
	const result = spawnSync(
		FFPROBE_BINARY,
		[
			'-v',
			'error',
			'-select_streams',
			'a',
			'-show_entries',
			'stream=codec_type',
			'-of',
			'csv=p=0',
			file_path,
		],
		{ encoding: 'utf8' },
	)

	return result.status === 0 && result.stdout.trim().length > 0
}

function convert(input_path: string, output_path: string): void {
	const result = spawnSync(
		FFMPEG_BINARY,
		['-y', '-i', input_path, ...opus_encoding.OPUS_FFMPEG_ARGS, output_path],
		{ stdio: 'inherit' },
	)

	if (result.status !== 0) {
		throw new Error(`ffmpeg failed for ${input_path} (exit ${String(result.status)})`)
	}
}

const REAL_PROBE: FileSystemProbe = { is_directory, list_directory }

function build_dependencies(): OpusConversionDependencies {
	return {
		collect_files: (input_path: string) => resolve_inputs(REAL_PROBE, input_path),
		has_audio_stream,
		convert,
	}
}

function report(summary: ConversionSummary): void {
	console.info(`Converted ${String(summary.converted.length)} file(s) to opus.`)

	for (const item of summary.skipped) {
		console.info(`Skipped ${item.path} (${item.reason}).`)
	}

	for (const item of summary.failed) {
		console.error(`Failed ${item.path} (${item.reason}).`)
	}
}

function main(args: ReadonlyArray<string>): void {
	const input_path = cli.read_required_argument(args, USAGE)

	report(run_conversion(build_dependencies(), input_path))
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

const audio_to_opus = {
	build_output_path,
	is_opus_file,
	resolve_inputs,
	run_conversion,
	build_dependencies,
	report,
	main,
}

export type { ConversionSummary, FileNote, FileSystemProbe, OpusConversionDependencies }
export { audio_to_opus }
