import { search_tokenizer } from '$lib/utils/tokenize'
import { describe, expect, it } from 'vitest'

describe('search_tokenizer.tokenize', () => {
	it('splits Japanese text into bigrams', () => {
		expect(search_tokenizer.tokenize('記憶ゲーム')).toStrictEqual(['記憶', '憶ゲ', 'ゲー', 'ーム'])
	})

	it('keeps ASCII words whole and lowercases them', () => {
		expect(search_tokenizer.tokenize('Claude Code')).toStrictEqual(['claude', 'code'])
	})

	it('splits mixed ASCII and Japanese runs at the boundary', () => {
		expect(search_tokenizer.tokenize('web開発')).toStrictEqual(['web', '開発'])
	})

	it('drops punctuation and whitespace', () => {
		expect(search_tokenizer.tokenize('AI、と！')).toStrictEqual(['ai', 'と'])
	})

	it('returns an empty array for blank input', () => {
		expect(search_tokenizer.tokenize(' '.repeat(3))).toStrictEqual([])
	})
})
