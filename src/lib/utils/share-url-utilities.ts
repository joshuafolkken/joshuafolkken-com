import { URLS } from '$lib/app'

function build_facebook_share_url(url: string): string {
	return `${URLS.SHARE_FACEBOOK}?u=${encodeURIComponent(url)}`
}

function build_twitter_share_url(url: string, text: string): string {
	const parameters = new URLSearchParams({
		url,
		text,
	})
	return `${URLS.SHARE_TWITTER}?${parameters.toString()}`
}

const share_url_utilities = {
	build_facebook_share_url,
	build_twitter_share_url,
}

export { share_url_utilities }
