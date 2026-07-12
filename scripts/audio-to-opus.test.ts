import { describe, expect, it, vi } from 'vitest'
import {
	audio_to_opus,
	type FileSystemProbe,
	type OpusConversionDependencies,
} from './audio-to-opus'

const AAC_FILE = 'dir/a.aac'
const OPUS_FILE = 'dir/b.opus'
const NO_EXT_FILE = 'dir/d'
const SECOND_AAC_FILE = 'dir/e.aac'
const COLLIDING_FILE = 'dir/a.wav'
const RECORDING = 'a/b/recording'
const RECORDING_OPUS = `${RECORDING}.opus`
const FAILURE_REASON = 'broken stream'

describe('audio_to_opus.build_output_path', () => {
	it('replaces the input extension with .opus in the same directory', () => {
		expect(audio_to_opus.build_output_path(`${RECORDING}.aac`)).toBe(RECORDING_OPUS)
	})

	it('handles an extension-less input path', () => {
		expect(audio_to_opus.build_output_path(RECORDING)).toBe(RECORDING_OPUS)
	})
})

describe('audio_to_opus.is_opus_file', () => {
	it('matches regardless of case', () => {
		expect(audio_to_opus.is_opus_file('a/b/clip.OPUS')).toBe(true)
		expect(audio_to_opus.is_opus_file('a/b/clip.aac')).toBe(false)
	})
})

interface ConversionFakes {
	dependencies: OpusConversionDependencies
	convert: ReturnType<typeof vi.fn>
}

function build_fakes(
	files: ReadonlyArray<string>,
	audio_files: ReadonlyArray<string>,
): ConversionFakes {
	const convert = vi.fn()
	const dependencies: OpusConversionDependencies = {
		collect_files: vi.fn().mockReturnValue(files),
		has_audio_stream: vi.fn((file_path: string) => audio_files.includes(file_path)),
		convert,
	}

	return { dependencies, convert }
}

describe('audio_to_opus.resolve_inputs', () => {
	it('scans the directory when the input path is a directory', () => {
		const list_directory = vi.fn().mockReturnValue([AAC_FILE, OPUS_FILE])
		const probe: FileSystemProbe = { is_directory: vi.fn().mockReturnValue(true), list_directory }

		expect(audio_to_opus.resolve_inputs(probe, 'dir')).toEqual([AAC_FILE, OPUS_FILE])
		expect(list_directory).toHaveBeenCalledWith('dir')
	})

	it('returns the single file as a one-element list when the input path is a file', () => {
		const list_directory = vi.fn()
		const probe: FileSystemProbe = { is_directory: vi.fn().mockReturnValue(false), list_directory }

		expect(audio_to_opus.resolve_inputs(probe, AAC_FILE)).toEqual([AAC_FILE])
		expect(list_directory).not.toHaveBeenCalled()
	})
})

describe('audio_to_opus.run_conversion classification', () => {
	it('converts decodable audio and skips opus and non-audio files', () => {
		const files = [AAC_FILE, OPUS_FILE, 'dir/c.txt', NO_EXT_FILE]
		const { dependencies } = build_fakes(files, [AAC_FILE, NO_EXT_FILE])

		const summary = audio_to_opus.run_conversion(dependencies, 'dir')

		expect(summary.converted).toEqual([AAC_FILE, NO_EXT_FILE])
		expect(summary.failed).toEqual([])
		expect(summary.skipped).toEqual([
			{ path: OPUS_FILE, reason: 'already opus' },
			{ path: 'dir/c.txt', reason: 'no decodable audio stream' },
		])
	})

	it('converts each audio file to its sibling .opus path', () => {
		const { dependencies, convert } = build_fakes([AAC_FILE], [AAC_FILE])

		audio_to_opus.run_conversion(dependencies, 'dir')

		expect(convert).toHaveBeenCalledWith(AAC_FILE, 'dir/a.opus')
	})

	it('never probes or converts an already-opus file', () => {
		const { dependencies, convert } = build_fakes([OPUS_FILE], [])

		audio_to_opus.run_conversion(dependencies, 'dir')

		expect(dependencies.has_audio_stream).not.toHaveBeenCalled()
		expect(convert).not.toHaveBeenCalled()
	})
})

describe('audio_to_opus.run_conversion resilience', () => {
	it('records an ffmpeg failure without aborting the rest of the batch', () => {
		const { dependencies, convert } = build_fakes(
			[AAC_FILE, SECOND_AAC_FILE],
			[AAC_FILE, SECOND_AAC_FILE],
		)

		convert.mockImplementationOnce(() => {
			throw new Error(FAILURE_REASON)
		})

		const summary = audio_to_opus.run_conversion(dependencies, 'dir')

		expect(summary.failed).toEqual([{ path: AAC_FILE, reason: FAILURE_REASON }])
		expect(summary.converted).toEqual([SECOND_AAC_FILE])
	})

	it('skips a later file whose output path collides with an earlier one', () => {
		const { dependencies, convert } = build_fakes(
			[AAC_FILE, COLLIDING_FILE],
			[AAC_FILE, COLLIDING_FILE],
		)

		const summary = audio_to_opus.run_conversion(dependencies, 'dir')

		expect(summary.converted).toEqual([AAC_FILE])
		expect(summary.skipped).toEqual([
			{ path: COLLIDING_FILE, reason: 'output path already produced by another file this run' },
		])
		expect(convert).toHaveBeenCalledTimes(1)
	})
})
