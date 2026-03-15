import type { Handle } from '@sveltejs/kit'
import { security } from '$lib/server/security'

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.url.pathname.startsWith('/blog') ? 'ja' : 'en'

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang),
	})

	security.add_security_headers(response)

	return response
}
