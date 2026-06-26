import { like_api } from '$lib/api/like-api'
import { ERROR_MESSAGES } from '$lib/constants/http'
import { logger } from '$lib/logger'
import { liked_posts } from '$lib/stores/LikedPosts.svelte'

const ANIMATION_DURATION = 1000
const INCREMENT = 1

export class LikeState {
	#slug: string
	#animation_timer: ReturnType<typeof setTimeout> | undefined = undefined
	count = $state(0)
	is_liked = $state(false)
	is_animating = $state(false)

	constructor(slug: string, initial_count = 0) {
		this.count = initial_count
		this.#slug = slug

		$effect(() => {
			if (liked_posts.instance.has_liked(this.#slug)) {
				this.is_liked = true
			}

			let is_cancelled = false

			void this.#fetch_likes(() => is_cancelled)

			return () => {
				is_cancelled = true
				this.#clear_animation_timer()
			}
		})
	}

	#clear_animation_timer(): void {
		if (this.#animation_timer === undefined) return
		clearTimeout(this.#animation_timer)
		this.#animation_timer = undefined
	}

	#rollback(previous_count: number): void {
		this.is_liked = false
		this.count = previous_count
		this.is_animating = false
		liked_posts.instance.remove_like(this.#slug)
	}

	async #fetch_likes(is_cancelled: () => boolean): Promise<void> {
		try {
			const data = await like_api.get(this.#slug)
			if (!is_cancelled()) this.count = data.likes
		} catch (error) {
			if (!is_cancelled()) logger.error(ERROR_MESSAGES.FAILED_TO_GET_LIKES, error)
		}
	}

	async toggle(): Promise<void> {
		if (this.is_liked) return

		const previous_count = this.count

		this.is_liked = true
		this.count += INCREMENT
		this.is_animating = true
		liked_posts.instance.add_like(this.#slug)

		this.#clear_animation_timer()
		this.#animation_timer = setTimeout(() => {
			this.is_animating = false
			this.#animation_timer = undefined
		}, ANIMATION_DURATION)

		try {
			const data = await like_api.increment(this.#slug)

			this.count = data.likes
		} catch (error) {
			logger.error(ERROR_MESSAGES.FAILED_TO_INCREMENT_LIKES, error)
			this.#rollback(previous_count)
		}
	}
}
