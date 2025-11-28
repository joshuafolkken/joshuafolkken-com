import { like_api } from '$lib/api/like-api'
import { liked_posts } from '$lib/stores/LikedPosts.svelte'

const ANIMATION_DURATION = 1000
const INCREMENT = 1

export class LikeState {
	count = $state(0)
	is_liked = $state(false)
	is_animating = $state(false)
	#slug: string

	constructor(slug: string, initial_count = 0) {
		this.count = initial_count
		this.#slug = slug

		$effect(() => {
			if (liked_posts.instance.has_liked(this.#slug)) {
				this.is_liked = true
			}

			void this.#fetch_likes()
		})
	}

	async #fetch_likes(): Promise<void> {
		try {
			const data = await like_api.get(this.#slug)
			this.count = data.likes
		} catch (error) {
			console.error('Failed to fetch likes:', error)
		}
	}

	async toggle(): Promise<void> {
		if (this.is_liked) return

		const previous_count = this.count

		// Optimistic UI update
		this.is_liked = true
		this.count += INCREMENT
		this.is_animating = true
		liked_posts.instance.add_like(this.#slug)

		setTimeout(() => {
			this.is_animating = false
		}, ANIMATION_DURATION)

		try {
			const data = await like_api.increment(this.#slug)
			this.count = data.likes
		} catch (error) {
			console.error('Failed to like:', error)
			// Rollback
			this.is_liked = false
			this.count = previous_count
			this.is_animating = false
			liked_posts.instance.remove_like(this.#slug)
		}
	}
}
