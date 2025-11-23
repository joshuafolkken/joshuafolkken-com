import { browser } from '$app/environment'

const STORAGE_KEY = 'liked_posts'

function load_from_storage(): Array<string> {
	if (!browser) return []

	const stored = localStorage.getItem(STORAGE_KEY)
	if (stored === null) return []

	try {
		const parsed = JSON.parse(stored) as unknown
		if (Array.isArray(parsed)) {
			return parsed as Array<string>
		}
	} catch (error) {
		console.error('Failed to parse liked posts:', error)
	}
	return []
}

function save_to_storage(likes: Array<string>): void {
	if (!browser) return
	localStorage.setItem(STORAGE_KEY, JSON.stringify(likes))
}

class LikedPostsStore {
	#likes = $state<Array<string>>([])

	constructor() {
		this.#likes = load_from_storage()

		$effect.root(() => {
			$effect(() => {
				save_to_storage(this.#likes)
			})
		})
	}

	get likes(): Array<string> {
		return this.#likes
	}

	has_liked(slug: string): boolean {
		return this.#likes.includes(slug)
	}

	add_like(slug: string): void {
		if (!this.has_liked(slug)) {
			this.#likes = [...this.#likes, slug]
		}
	}
}

const liked_posts = {
	instance: new LikedPostsStore(),
}

export { liked_posts }
