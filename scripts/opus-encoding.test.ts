import { describe, expect, it } from 'vitest'
import { opus_encoding } from './opus-encoding'

describe('opus_encoding.OPUS_FFMPEG_ARGS', () => {
	it('encodes libopus at 16 kbps mono', () => {
		expect(opus_encoding.OPUS_FFMPEG_ARGS).toEqual(['-c:a', 'libopus', '-b:a', '16k', '-ac', '1'])
	})
})

describe('opus_encoding.build_yt_dlp_postprocessor_args', () => {
	it('joins the shared flags into a yt-dlp ffmpeg postprocessor string', () => {
		expect(opus_encoding.build_yt_dlp_postprocessor_args()).toBe(
			'ffmpeg:-c:a libopus -b:a 16k -ac 1',
		)
	})
})
