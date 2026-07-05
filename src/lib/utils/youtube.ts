// Extracts an 11-character video id from watch (?v=), share (youtu.be/), and embed (/embed/) URLs.
const YOUTUBE_ID_PATTERN = /(?:youtu\.be\/|[?&]v=|\/embed\/)([\w-]{11})/u
const EMBED_BASE = 'https://www.youtube-nocookie.com/embed/'

function get_video_id(url: string | undefined): string | undefined {
	if (typeof url !== 'string') return undefined

	return YOUTUBE_ID_PATTERN.exec(url)?.[1]
}

function get_embed_url(url: string | undefined): string | undefined {
	const video_id = get_video_id(url)

	return video_id ? `${EMBED_BASE}${video_id}` : undefined
}

export const youtube = {
	get_video_id,
	get_embed_url,
}
