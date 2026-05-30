import { error } from '@sveltejs/kit'
import { ERROR_MESSAGES, HTTP_STATUS } from '$lib/constants/http'
import type { BlogMetadata } from '$lib/types/blog'
import { ads_visibility } from '$lib/utils/ads-visibility'
import { content_length } from '$lib/utils/content-length'
import { slug_validator } from '$lib/utils/slug-validator'
import type { Component } from 'svelte'
import type { PageLoad } from './$types'

const raw_posts = import.meta.glob('/src/lib/posts/*.md', { query: '?raw', import: 'default' })

function throw_not_found(): never {
	/* eslint-disable-next-line @typescript-eslint/only-throw-error -- SvelteKit error() throws HttpError */
	throw error(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND)
}

async function measure_post_length(slug: string): Promise<number> {
	const loader = raw_posts[`/src/lib/posts/${slug}.md`]
	if (!loader) return 0

	const raw = await loader()

	return typeof raw === 'string' ? content_length.measure(raw) : 0
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

		const post_length = await measure_post_length(slug)

		return {
			content: post.default,
			meta: post.metadata,
			excerpt: post.metadata.excerpt,
			slug,
			should_show_ads: ads_visibility.should_show_ads(post_length),
		}
	} catch {
		return throw_not_found()
	}
}
