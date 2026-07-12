import { describe, expect, it, vi } from 'vitest'
import { yt_audio } from './yt-audio'

const URL = 'https://www.youtube.com/watch?v=testVideo12'

describe('yt_audio.build_yt_dlp_args', () => {
	it('uses the shared opus postprocessor args', () => {
		const args = yt_audio.build_yt_dlp_args([])

		expect(args).toContain('--postprocessor-args')
		expect(args).toContain('ffmpeg:-c:a libopus -b:a 16k -ac 1')
	})

	it('appends caller-supplied arguments verbatim', () => {
		const args = yt_audio.build_yt_dlp_args([URL])

		expect(args.at(-1)).toBe(URL)
	})
})

describe('yt_audio.run_yt_dlp', () => {
	it('spawns yt-dlp with the built arguments', () => {
		const spawn = vi.fn(() => ({ status: 0 }))

		yt_audio.run_yt_dlp(spawn, [URL])

		expect(spawn).toHaveBeenCalledWith('yt-dlp', yt_audio.build_yt_dlp_args([URL]))
	})

	it('throws when the spawn reports an error', () => {
		const spawn = vi.fn(() => ({ status: 0, error: new Error('not found') }))

		expect(() => {
			yt_audio.run_yt_dlp(spawn, [URL])
		}).toThrow('yt-dlp failed: not found')
	})

	it('throws when yt-dlp exits non-zero', () => {
		const spawn = vi.fn(() => ({ status: 1 }))

		expect(() => {
			yt_audio.run_yt_dlp(spawn, [URL])
		}).toThrow('yt-dlp exited with 1')
	})
})
