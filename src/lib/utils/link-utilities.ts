import { resolve } from '$app/paths'

type InternalPath = '/blog' | '/projects' | '/profile' | '/privacy-policy'

function is_external_link(link: string | undefined): boolean {
	return Boolean(link?.startsWith('http'))
}

function get_href(link: string | undefined): string | undefined {
	if (!link) return undefined
	if (link.startsWith('http')) return link

	return resolve(link as InternalPath)
}

const link_utilities = {
	get_href,
	is_external_link,
}

export { link_utilities }
