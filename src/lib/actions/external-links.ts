import type { Action } from 'svelte/action'

const external_links: Action = (node: HTMLElement) => {
	const apply = (): void => {
		const links = node.querySelectorAll('a')

		for (const link of links) {
			if (link.href.startsWith('http')) {
				link.setAttribute('target', '_blank')
				link.setAttribute('rel', 'noopener noreferrer')
			}
		}
	}

	apply()

	return {
		update: apply,
	}
}

export const external_links_action = { external_links }
