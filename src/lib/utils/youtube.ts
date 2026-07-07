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

export const youtube = {
	get_video_id,
	get_embed_url,
}
