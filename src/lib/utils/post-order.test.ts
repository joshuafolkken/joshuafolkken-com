import type { Post } from '$lib/types/blog'
import { describe, expect, it } from 'vitest'
import { post_order } from './post-order'

const PUBLISHED_OLD = '2025-11-23'
const PUBLISHED_RECENT = '2026-08-12'
const PUBLISHED_MID = '2026-07-06'
const UPDATED_LATE = '2026-08-20 14:00'

function make_post(slug: string, date: string, updated?: string): Post {
	return { slug, title: slug, date, updated, excerpt: 'An excerpt.' }
}

describe('post_order.get_effective_date', () => {
	it('returns the updated date when the post was revised', () => {
		const post = make_post('revised', PUBLISHED_OLD, UPDATED_LATE)

		expect(post_order.get_effective_date(post)).toBe(UPDATED_LATE)
	})

	it('returns the publication date when the post was never revised', () => {
		const post = make_post('fresh', PUBLISHED_RECENT)

		expect(post_order.get_effective_date(post)).toBe(PUBLISHED_RECENT)
	})
})

describe('post_order.sort_by_effective_date', () => {
	it('places an older post with a newer update above a recently published post', () => {
		const revised = make_post('revised', PUBLISHED_OLD, UPDATED_LATE)
		const recent = make_post('recent', PUBLISHED_RECENT)

		const result = post_order.sort_by_effective_date([recent, revised])

		expect(result.map((post) => post.slug)).toEqual(['revised', 'recent'])
	})

	it('orders posts without an update by publication date, newest first', () => {
		const older = make_post('older', PUBLISHED_MID)
		const newer = make_post('newer', PUBLISHED_RECENT)

		const result = post_order.sort_by_effective_date([older, newer])

		expect(result.map((post) => post.slug)).toEqual(['newer', 'older'])
	})

	it('breaks a tie on the effective date by publication date, newest first', () => {
		const older = make_post('older', PUBLISHED_OLD, UPDATED_LATE)
		const newer = make_post('newer', PUBLISHED_MID, UPDATED_LATE)

		const result = post_order.sort_by_effective_date([older, newer])

		expect(result.map((post) => post.slug)).toEqual(['newer', 'older'])
	})

	it('leaves the input array untouched', () => {
		const posts = [make_post('older', PUBLISHED_MID), make_post('newer', PUBLISHED_RECENT)]

		post_order.sort_by_effective_date(posts)

		expect(posts.map((post) => post.slug)).toEqual(['older', 'newer'])
	})
})
