import { browser } from '$app/environment'
import { logger } from '$lib/logger'

const STORAGE_KEY = 'liked_posts'

function load_from_storage(): Array<string> {
	if (!browser) return []

	const stored = localStorage.getItem(STORAGE_KEY)
	if (!stored) return []

	try {
		const parsed = JSON.parse(stored) as unknown

		if (Array.isArray(parsed)) {
			return parsed as Array<string>
		}
	} catch (error) {
		logger.error('Failed to parse liked posts:', error)
	}

	return []
}

function save_to_storage(likes: Array<string>): void {
	if (!browser) return

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(likes))
	} catch (error) {
		logger.error('Failed to save liked posts:', error)
	}
}

class LikedPostsStore {
	#likes = $state<Array<string>>([])

	constructor() {
		this.#likes = load_from_storage()

		let is_initialized = false

		$effect.root(() => {
			$effect(() => {
				// 依存関係としてアクセス
				const current_likes = this.#likes

				if (!is_initialized) {
					is_initialized = true
					return
				}

				save_to_storage(current_likes)
			})
		})
	}

	has_liked(slug: string): boolean {
		return this.#likes.includes(slug)
	}

	add_like(slug: string): void {
		if (!this.has_liked(slug)) {
			this.#likes = [...this.#likes, slug]
		}
	}

	remove_like(slug: string): void {
		this.#likes = this.#likes.filter((stored_slug) => stored_slug !== slug)
	}
}

const liked_posts = {
	instance: new LikedPostsStore(),
}

export { liked_posts }
