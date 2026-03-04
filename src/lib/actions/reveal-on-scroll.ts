import type { Action } from 'svelte/action'

const REVEAL_THRESHOLD = 0.1

function reveal_on_scroll(node: HTMLElement): ReturnType<Action> {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed')
				}
			}
		},
		{ threshold: REVEAL_THRESHOLD },
	)

	observer.observe(node)

	return {
		destroy() {
			observer.disconnect()
		},
	}
}

const reveal_on_scroll_action = {
	reveal_on_scroll,
}

export { reveal_on_scroll_action }
