import { like_api } from '$lib/api/like-api'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LikeState } from './LikeState.svelte'

vi.mock('$lib/api/like-api', () => ({
	like_api: { get: vi.fn(), increment: vi.fn() },
}))

vi.mock('$lib/stores/LikedPosts.svelte', () => ({
	liked_posts: {
		instance: {
			has_liked: vi.fn().mockReturnValue(false),
			add_like: vi.fn(),
			remove_like: vi.fn(),
		},
	},
}))

vi.mock('$lib/logger', () => ({
	logger: { error: vi.fn() },
}))

const SLUG = 'test-post'
const INITIAL_COUNT = 5
const UPDATED_COUNT = 6
const ANIMATION_DURATION_MS = 1000

beforeEach(() => {
	vi.clearAllMocks()
})

afterEach(() => {
	vi.useRealTimers()
})

describe('LikeState constructor', () => {
	it('sets initial count', () => {
		const state = new LikeState(SLUG, INITIAL_COUNT)

		expect(state.count).toBe(INITIAL_COUNT)
	})

	it('is_liked is false when post has not been liked', () => {
		const state = new LikeState(SLUG)

		expect(state.is_liked).toBe(false)
	})
})

describe('LikeState.toggle — success', () => {
	it('sets is_liked and updates count from API', async () => {
		vi.mocked(like_api.increment).mockResolvedValue({ likes: UPDATED_COUNT })

		const state = new LikeState(SLUG, INITIAL_COUNT)

		await state.toggle()

		expect(state.is_liked).toBe(true)
		expect(state.count).toBe(UPDATED_COUNT)
	})

	it('resets is_animating to false after ANIMATION_DURATION', async () => {
		vi.useFakeTimers()
		vi.mocked(like_api.increment).mockResolvedValue({ likes: UPDATED_COUNT })

		const state = new LikeState(SLUG, INITIAL_COUNT)

		await state.toggle()

		expect(state.is_animating).toBe(true)

		vi.advanceTimersByTime(ANIMATION_DURATION_MS)

		expect(state.is_animating).toBe(false)
	})
})

describe('LikeState.toggle — guard', () => {
	it('is a no-op when already liked', async () => {
		const state = new LikeState(SLUG, INITIAL_COUNT)

		state.is_liked = true

		await state.toggle()

		expect(like_api.increment).not.toHaveBeenCalled()
	})
})

describe('LikeState.toggle — error rollback', () => {
	it('restores count and is_liked when increment fails', async () => {
		vi.mocked(like_api.increment).mockRejectedValue(new Error('Network error'))

		const state = new LikeState(SLUG, INITIAL_COUNT)

		await state.toggle()

		expect(state.is_liked).toBe(false)
		expect(state.count).toBe(INITIAL_COUNT)
		expect(state.is_animating).toBe(false)
	})
})
