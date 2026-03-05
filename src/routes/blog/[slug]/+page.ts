import { error } from '@sveltejs/kit'
import { ERROR_MESSAGES, HTTP_STATUS } from '$lib/constants/http'
import type { BlogMetadata } from '$lib/types/blog'
import { slug_validator } from '$lib/utils/slug-validator'
import type { Component } from 'svelte'
import type { PageLoad } from './$types'

function throw_not_found(): never {
	/* eslint-disable-next-line @typescript-eslint/only-throw-error -- SvelteKit error() throws HttpError */
	throw error(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND)
}

export const load: PageLoad = async ({ params }) => {
	const slug = slug_validator.parse_slug(params.slug)

	if (!slug) {
		throw_not_found()
	}

	try {
		const post = (await import(`../../../lib/posts/${slug}.md`)) as {
			default: Component
			metadata: BlogMetadata
		}

		return {
			content: post.default,
			meta: post.metadata,
			excerpt: post.metadata.excerpt,
			slug,
		}
	} catch {
		return throw_not_found()
	}
}
