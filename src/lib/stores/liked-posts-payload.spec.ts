import { expect, test, vi } from 'vitest'
import { liked_posts_payload } from './liked-posts-payload'

test('returns an empty array when the JSON root is not an array', () => {
	expect(liked_posts_payload.parse('{"notAnArray": true}')).toStrictEqual([])
})

test('returns an empty array when the JSON payload is malformed', () => {
	expect(liked_posts_payload.parse('not json')).toStrictEqual([])
})

test('returns an all-string array unchanged', () => {
	expect(liked_posts_payload.parse('["a","b","c"]')).toStrictEqual(['a', 'b', 'c'])
})

test('filters out non-string elements while keeping strings', () => {
	const raw = '[123,"ok",null,"also-ok",true]'

	expect(liked_posts_payload.parse(raw)).toStrictEqual(['ok', 'also-ok'])
})

test('returns an empty array for an empty array input', () => {
	expect(liked_posts_payload.parse('[]')).toStrictEqual([])
})

test('logs parse errors so corrupted storage is observable', () => {
	const error_spy = vi.spyOn(console, 'error').mockImplementation(vi.fn())

	liked_posts_payload.parse('not json')

	expect(error_spy).toHaveBeenCalled()
	error_spy.mockRestore()
})
