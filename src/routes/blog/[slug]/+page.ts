import { error } from '@sveltejs/kit'
import type { Component } from 'svelte'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
	try {
		const post = (await import(`../../../lib/posts/${params.slug}.md`)) as {
			default: Component
			metadata: {
				title: string
				date: string
				excerpt: string
				cover_image?: string
			}
		}

		return {
			content: post.default,
			meta: post.metadata,
			excerpt: post.metadata.excerpt,
		}
	} catch {
		const HTTP_NOT_FOUND = 404
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw error(HTTP_NOT_FOUND, `Could not find ${params.slug}`)
	}
}
