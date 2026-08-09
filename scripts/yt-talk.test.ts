import { afterEach, describe, expect, it, vi } from 'vitest'
import { audio_to_article, type ArticleDependencies } from './audio-to-article'
import { yt_talk, type TalkDependencies } from './yt-talk'

const VIDEO_ID = 'testVideo12'
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`
const OUTPUT_PATH = 'src/lib/posts/talk-2025-12-04.md'
const NOW = new Date(2026, 6, 10)

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllEnvs()
})

describe('yt_talk.is_audio_available', () => {
	it('returns true when the finder resolves', () => {
		expect(yt_talk.is_audio_available(() => ({ audio_path: 'x' }), VIDEO_ID)).toBe(true)
	})

	it('returns false when the finder throws', () => {
		expect(
			yt_talk.is_audio_available(() => {
				throw new Error('missing')
			}, VIDEO_ID),
		).toBe(false)
	})
})

interface TalkFakes {
	dependencies: TalkDependencies
	download_audio: ReturnType<typeof vi.fn>
	generate: ReturnType<typeof vi.fn>
}

function build_talk_fakes(is_present: boolean): TalkFakes {
	const download_audio = vi.fn()
	const generate = vi.fn().mockResolvedValue(OUTPUT_PATH)
	const dependencies: TalkDependencies = {
		is_audio_present: vi.fn().mockReturnValue(is_present),
		download_audio,
		generate,
	}

	return { dependencies, download_audio, generate }
}

describe('yt_talk.run_talk', () => {
	it('downloads then generates when audio is absent', async () => {
		const { dependencies, download_audio, generate } = build_talk_fakes(false)

		const result = await yt_talk.run_talk(dependencies, VIDEO_ID, NOW)

		expect(download_audio).toHaveBeenCalledWith(WATCH_URL)
		expect(generate).toHaveBeenCalledWith(VIDEO_ID, NOW)
		expect(result).toEqual({ output_path: OUTPUT_PATH, did_download: true })
	})

	it('skips the download but still generates when audio is present', async () => {
		const { dependencies, download_audio, generate } = build_talk_fakes(true)

		const result = await yt_talk.run_talk(dependencies, WATCH_URL, NOW)

		expect(download_audio).not.toHaveBeenCalled()
		expect(generate).toHaveBeenCalledWith(WATCH_URL, NOW)
		expect(result).toEqual({ output_path: OUTPUT_PATH, did_download: false })
	})
})

const REFERENCE_OVERRIDES = ['.audio/alt_target.opus', '.audio/alt_excluded.opus']

// Without this the overrides can be dropped on the yt:talk path while every other test stays
// green — the silent fallback to the default samples that this pipeline exists to prevent.
describe('yt_talk.build_talk_dependencies', () => {
	it('forwards the reference-sample overrides to the article generator', async () => {
		vi.stubEnv('GEMINI_API_KEY', 'key-1')
		const stub_dependencies: ArticleDependencies = {
			find_metadata: vi.fn(),
			find_audio: vi.fn(),
			find_references: vi.fn(),
			read_prompt: vi.fn(),
			generate: vi.fn(),
			write_article: vi.fn(),
		}
		const build_dependencies = vi
			.spyOn(audio_to_article, 'build_dependencies')
			.mockReturnValue(stub_dependencies)

		vi.spyOn(audio_to_article, 'run').mockResolvedValue(OUTPUT_PATH)

		await yt_talk.build_talk_dependencies(REFERENCE_OVERRIDES).generate(VIDEO_ID, NOW)

		expect(build_dependencies).toHaveBeenCalledWith(expect.anything(), REFERENCE_OVERRIDES)
	})
})

describe('yt_talk.main', () => {
	it('rejects a third sample path instead of running with the wrong pair', async () => {
		vi.stubEnv('GEMINI_API_KEY', 'key-1')

		await expect(yt_talk.main([VIDEO_ID, 'a.opus', 'b.opus', 'c.opus'], NOW)).rejects.toThrow(
			'Usage',
		)
	})
})
