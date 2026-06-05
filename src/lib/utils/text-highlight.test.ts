import { text_highlight } from '$lib/utils/text-highlight'
import { describe, expect, it } from 'vitest'

describe('text_highlight.highlight', () => {
	it('splits Japanese text into matched and unmatched segments', () => {
		expect(text_highlight.highlight('記憶ゲーム', 'ゲーム')).toStrictEqual([
			{ text: '記憶', is_match: false },
			{ text: 'ゲーム', is_match: true },
		])
	})

	it('matches case-insensitively for ASCII text', () => {
		expect(text_highlight.highlight('Claude Code', 'code')).toStrictEqual([
			{ text: 'Claude ', is_match: false },
			{ text: 'Code', is_match: true },
		])
	})

	it('returns a single unmatched segment for a blank query', () => {
		expect(text_highlight.highlight('hello', '   ')).toStrictEqual([
			{ text: 'hello', is_match: false },
		])
	})

	it('highlights every occurrence', () => {
		const segments = text_highlight.highlight('aXaXa', 'x')

		expect(segments.filter((segment) => segment.is_match)).toHaveLength(2)
	})
})
