import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.url.pathname.startsWith('/blog') ? 'ja' : 'en'

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang),
	})
}
