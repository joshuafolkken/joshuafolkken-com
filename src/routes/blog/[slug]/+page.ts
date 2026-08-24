import { error } from '@sveltejs/kit'
import { ERROR_MESSAGES, HTTP_STATUS } from '$lib/constants/http'
import type { BlogMetadata } from '$lib/types/blog'
import { content_quality } from '$lib/utils/content-quality'
import { post_length } from '$lib/utils/post-length'
import { slug_validator } from '$lib/utils/slug-validator'
import type { Component } from 'svelte'
import type { PageLoad } from './$types'

function throw_not_found(): never {
	/* eslint-disable-next-line @typescript-eslint/only-throw-error -- SvelteKit error() throws HttpError */
	throw error(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND)
}

export const load: PageLoad = async ({ params, data }) => {
	const slug = slug_validator.parse_slug(params.slug)

	if (!slug) {
		throw_not_found()
	}

	try {
		const post = (await import(`../../../lib/posts/${slug}.md`)) as {
			default: Component
			metadata: BlogMetadata
		}

		const is_substantial = content_quality.is_substantial(await post_length.measure(slug))

		return {
			...data,
			content: post.default,
			meta: post.metadata,
			excerpt: post.metadata.excerpt,
			slug,
			should_show_ads: is_substantial,
			should_index: is_substantial,
		}
	} catch {
		return throw_not_found()
	}
}
