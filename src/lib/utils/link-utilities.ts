import { resolve } from '$app/paths'
import type { Pathname } from '$app/types'
import { LINK_REL, LINK_TARGET } from '$lib/app'

const PROTOCOL_HTTP_PREFIX = 'http'
const INTERNAL_PATH_PREFIX = '/'
const BLOG_SLUG_PREFIX = '/blog/'

const INTERNAL_PATHS = [
	'/',
	'/about',
	'/blog',
	'/contact',
	'/privacy',
	'/projects',
	'/terms',
] as const

type InternalPath = (typeof INTERNAL_PATHS)[number]

const INTERNAL_PATH_SET: ReadonlySet<string> = new Set(INTERNAL_PATHS)

function is_external_link(link?: string): boolean {
	return Boolean(link?.startsWith(PROTOCOL_HTTP_PREFIX))
}

function is_internal_path(link: string): link is InternalPath {
	return INTERNAL_PATH_SET.has(link)
}

function is_pathname(link: string): link is Pathname {
	if (is_internal_path(link)) return true
	if (link.startsWith(BLOG_SLUG_PREFIX)) return link.length > BLOG_SLUG_PREFIX.length

	return false
}

function get_href(link?: string): string | undefined {
	if (!link) return undefined
	if (link.startsWith(PROTOCOL_HTTP_PREFIX)) return link
	if (is_pathname(link)) return resolve(link)
	if (link.startsWith(INTERNAL_PATH_PREFIX)) return link

	return undefined
}

function is_internal_link(link?: string): boolean {
	return Boolean(link && !is_external_link(link))
}

interface LinkInfo {
	href: string | undefined
	is_external: boolean
	is_link: boolean
	target?: string
	rel?: string
}

function get_link_info(link?: string): LinkInfo {
	const href = get_href(link)
	const is_internal = Boolean(href && is_internal_link(link))
	const is_external = Boolean(href && !is_internal)

	return {
		href,
		is_link: is_internal,
		is_external,
		...(is_external ? { target: LINK_TARGET, rel: LINK_REL } : {}),
	}
}

const link_utilities = {
	get_href,
	get_link_info,
	is_external_link,
	is_internal_link,
	is_internal_path,
}

export type { LinkInfo }
export { INTERNAL_PATHS, link_utilities }
