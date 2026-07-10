import { describe, expect, it } from 'vitest'
import { youtube } from './youtube'

const VIDEO_ID = 'UI3-GR6yvjY'
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`
const NON_YOUTUBE_URL = 'https://example.com/video'
const NO_ID_TITLE = 'returns undefined when no id can be extracted'
const NON_STRING_TITLE = 'returns undefined for a non-string value'

describe('youtube.get_video_id', () => {
	it('extracts the id from a watch URL', () => {
		expect(youtube.get_video_id(WATCH_URL)).toBe(VIDEO_ID)
	})

	it('extracts the id from a share URL', () => {
		expect(youtube.get_video_id(`https://youtu.be/${VIDEO_ID}`)).toBe(VIDEO_ID)
	})

	it('extracts the id from an embed URL', () => {
		expect(youtube.get_video_id(`https://www.youtube.com/embed/${VIDEO_ID}`)).toBe(VIDEO_ID)
	})

	it('extracts the id when extra query params follow', () => {
		expect(youtube.get_video_id(`${WATCH_URL}&t=42s`)).toBe(VIDEO_ID)
	})

	it('returns undefined for a non-YouTube URL', () => {
		expect(youtube.get_video_id(NON_YOUTUBE_URL)).toBeUndefined()
	})

	it('returns undefined for an embed-shaped URL on a non-YouTube host', () => {
		expect(youtube.get_video_id(`https://evil.com/embed/${VIDEO_ID}`)).toBeUndefined()
	})

	it('returns undefined for a watch-shaped URL on a non-YouTube host', () => {
		expect(youtube.get_video_id(`https://evil.com/watch?v=${VIDEO_ID}`)).toBeUndefined()
	})

	it(NON_STRING_TITLE, () => {
		expect(youtube.get_video_id(undefined)).toBeUndefined()
	})
})

describe('youtube.get_embed_url', () => {
	it('builds a privacy-friendly embed URL from a watch URL', () => {
		expect(youtube.get_embed_url(WATCH_URL)).toBe(EMBED_URL)
	})

	it(NO_ID_TITLE, () => {
		expect(youtube.get_embed_url(NON_YOUTUBE_URL)).toBeUndefined()
	})
})
