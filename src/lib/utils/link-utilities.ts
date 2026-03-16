import { resolve } from '$app/paths'
import { LINK_REL, LINK_TARGET } from '$lib/app'

const PROTOCOL_HTTP_PREFIX = 'http'

type InternalPath = '/' | '/blog' | '/projects' | '/profile' | '/privacy-policy'

function is_external_link(link: string | undefined): boolean {
	return Boolean(link?.startsWith(PROTOCOL_HTTP_PREFIX))
}

function get_href(link: string | undefined): string | undefined {
	if (!link) return undefined
	if (link.startsWith(PROTOCOL_HTTP_PREFIX)) return link

	return resolve(link as InternalPath)
}

function is_internal_link(link: string | undefined): boolean {
	return Boolean(link && !is_external_link(link))
}

interface LinkInfo {
	href: string | undefined
	is_external: boolean
	is_link: boolean
	target?: string
	rel?: string
}

function get_link_info(link: string | undefined): LinkInfo {
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
}

export type { LinkInfo }
export { link_utilities }
