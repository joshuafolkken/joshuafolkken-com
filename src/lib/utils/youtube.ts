// Extracts an 11-character video id from watch (?v=), share (youtu.be/), and embed (/embed/) URLs
// hosted on YouTube. Non-YouTube hosts are rejected so a mistyped URL is not coerced into an embed.
const YOUTUBE_HOSTS = new Set([
	'youtube.com',
	'www.youtube.com',
	'm.youtube.com',
	'youtu.be',
	'youtube-nocookie.com',
	'www.youtube-nocookie.com',
])
const VIDEO_ID_PATTERN = /^[\w-]{11}$/u
const EMBED_BASE = 'https://www.youtube-nocookie.com/embed/'

// hqdefault is the one variant YouTube generates for every video. maxresdefault and hq720 exist
// only for HD sources — half of this site's talk videos return 404 for them — and a 404 cannot be
// recovered from at runtime: the CSP in `svelte.config.js` blocks the inline `onerror` attribute
// Svelte emits for SSR event replay, so the card would just show a broken image. hqdefault is
// 480x360 with the 16:9 frame letterboxed inside it, and the card crops to 16:9, so the black
// bars fall outside the crop and only the 480x270 frame remains.
const THUMBNAIL_BASE = 'https://i.ytimg.com/vi/'
const THUMBNAIL_FILE = '/hqdefault.jpg'

function parse_youtube_url(url: string): URL | undefined {
	try {
		const parsed = new URL(url)

		return YOUTUBE_HOSTS.has(parsed.hostname) ? parsed : undefined
	} catch {
		return undefined
	}
}

function extract_id(parsed: URL): string | undefined {
	const from_query = parsed.searchParams.get('v')
	if (from_query) return from_query

	return parsed.pathname.split('/').pop()
}

function get_video_id(url: string | undefined): string | undefined {
	if (typeof url !== 'string') return undefined

	const parsed = parse_youtube_url(url)
	if (!parsed) return undefined

	const id = extract_id(parsed)

	return id && VIDEO_ID_PATTERN.test(id) ? id : undefined
}

function get_embed_url(url: string | undefined): string | undefined {
	const video_id = get_video_id(url)

	return video_id ? `${EMBED_BASE}${video_id}` : undefined
}

function get_thumbnail_url(url: string | undefined): string | undefined {
	const video_id = get_video_id(url)

	return video_id ? `${THUMBNAIL_BASE}${video_id}${THUMBNAIL_FILE}` : undefined
}

export const youtube = {
	get_video_id,
	get_embed_url,
	get_thumbnail_url,
}
