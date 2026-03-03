const DEBOUNCE_DELAY = 10
const DEFAULT_STICKY_THRESHOLD = -90

export class StickyHeaderState {
	is_sticky = $state(false)
	#header_element = $state<HTMLElement | undefined>()
	#debounce_timer: ReturnType<typeof setTimeout> | undefined = undefined
	readonly #sticky_threshold: number

	constructor(sticky_threshold = DEFAULT_STICKY_THRESHOLD) {
		this.#sticky_threshold = sticky_threshold
	}

	set_element(element: HTMLElement): void {
		this.#header_element = element
	}

	update_sticky_state(): void {
		if (!this.#header_element) return
		const header_rect = this.#header_element.getBoundingClientRect()
		this.is_sticky = header_rect.top < this.#sticky_threshold
	}

	handle_scroll(): void {
		clearTimeout(this.#debounce_timer)
		this.#debounce_timer = setTimeout(() => {
			this.update_sticky_state()
		}, DEBOUNCE_DELAY)
	}

	destroy(): void {
		clearTimeout(this.#debounce_timer)
	}
}
