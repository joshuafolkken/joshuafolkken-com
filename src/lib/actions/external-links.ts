import { LINK_REL, LINK_TARGET } from '$lib/app'
import { link_utilities } from '$lib/utils/link-utilities'
import type { Action } from 'svelte/action'

// Check for dangerous URL protocols to prevent XSS (not used as script URL)
const DANGEROUS_PROTOCOLS: ReadonlyArray<string> = [
	/* eslint-disable-next-line no-script-url -- security check, not script execution */
	'javascript:',
	'data:',
	'vbscript:',
] as const

function is_dangerous_href(href: string): boolean {
	const normalized = href.trim().toLowerCase()

	return DANGEROUS_PROTOCOLS.some((protocol) => normalized.startsWith(protocol))
}

const external_links: Action = (node: HTMLElement) => {
	const apply = (): void => {
		const links = node.querySelectorAll('a')

		for (const link of links) {
			const href = link.getAttribute('href') ?? ''

			if (is_dangerous_href(href)) {
				link.setAttribute('href', '#')
			} else if (link_utilities.is_external_link(href)) {
				link.setAttribute('target', LINK_TARGET)
				link.setAttribute('rel', LINK_REL)
			}
		}
	}

	apply()

	return {
		update: apply,
	}
}

export { external_links }
