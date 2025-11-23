import { APP } from '$lib/app'
import { liked_posts } from '$lib/stores/LikedPosts.svelte'

const ANIMATION_DURATION = 1000
const INCREMENT = 1

export class LikeState {
	count = $state(0)
	is_liked = $state(false)
	is_animating = $state(false)
	#slug: string

	constructor(initial_count: number, slug: string) {
		this.count = initial_count
		this.#slug = slug

		$effect(() => {
			if (liked_posts.instance.has_liked(this.#slug)) {
				this.is_liked = true
			}
		})
	}

	async toggle(): Promise<void> {
		if (this.is_liked) return

		// Optimistic UI update
		this.is_liked = true
		this.count += INCREMENT
		this.is_animating = true
		liked_posts.instance.add_like(this.#slug)

		setTimeout(() => {
			this.is_animating = false
		}, ANIMATION_DURATION)

		try {
			await fetch('/api/like', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-App-Client': APP.ID,
				},
				body: JSON.stringify({ slug: this.#slug }),
			})
		} catch (error) {
			console.error('Failed to like:', error)
		}
	}
}
