import { describe, expect, it, vi } from 'vitest'
import { yt_talk, type TalkDependencies } from './yt-talk'

const VIDEO_ID = 'testVideo12'
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`
const OUTPUT_PATH = 'src/lib/posts/talk-2025-12-04.md'
const NOW = new Date(2026, 6, 10)

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
