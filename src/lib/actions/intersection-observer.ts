import type { Action } from 'svelte/action'

const INTERSECTION_THRESHOLD = 0

/* eslint-disable promise/prefer-await-to-callbacks */
const intersect: Action<HTMLElement, (() => void) | undefined> = (node, callback) => {
	const observer = new IntersectionObserver(
		(entries) => {
			const [entry] = entries

			if (entry?.isIntersecting) {
				callback?.()
				observer.disconnect()
			}
		},
		{ threshold: INTERSECTION_THRESHOLD },
	)

	observer.observe(node)

	return {
		destroy() {
			observer.disconnect()
		},
	}
}
/* eslint-enable promise/prefer-await-to-callbacks */

export const intersection_observer = {
	intersect,
}
