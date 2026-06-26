import type { Handle } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import { blog_redirects } from '$lib/server/blog-redirects'
import { security } from '$lib/server/security'

export const handle: Handle = async ({ event, resolve }) => {
	const redirect_target = blog_redirects.get_redirect_target(event.url.pathname)

	if (redirect_target !== undefined) {
		return new Response(undefined, {
			status: HTTP_STATUS.PERMANENT_REDIRECT,
			headers: { location: redirect_target },
		})
	}

	const lang = event.url.pathname.startsWith('/blog') ? 'ja' : 'en'

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', () => lang),
	})

	security.add_security_headers(response)

	return response
}
