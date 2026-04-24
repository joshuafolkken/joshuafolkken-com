import { describe, expect, it } from 'vitest'
import { get_card_body_padding, get_demo_tag_row_class } from './project-card-layout'

describe('get_card_body_padding', () => {
	describe('when should_include_tags is true', () => {
		it('returns clearance padding when has_secondary_link is true', () => {
			expect(get_card_body_padding(true, true, false)).toBe('pb-16')
		})

		it('returns empty string when has_secondary_link is false', () => {
			expect(get_card_body_padding(true, false, false)).toBe('')
		})

		it('ignores has_tag_list when tags are included inside', () => {
			expect(get_card_body_padding(true, false, true)).toBe('')
		})
	})

	describe('when should_include_tags is false', () => {
		it('returns before-external-tags padding when has_tag_list is true', () => {
			expect(get_card_body_padding(false, false, true)).toBe('pb-2')
		})

		it('returns clearance padding when has_secondary_link is true and no tag list', () => {
			expect(get_card_body_padding(false, true, false)).toBe('pb-16')
		})

		it('returns section-default padding when no secondary link and no tag list', () => {
			expect(get_card_body_padding(false, false, false)).toBe('pb-6')
		})
	})
})

describe('get_demo_tag_row_class', () => {
	it('includes clearance padding when has_secondary_link is true', () => {
		expect(get_demo_tag_row_class(true)).toBe('px-6 pb-16')
	})

	it('includes section-default padding when has_secondary_link is false', () => {
		expect(get_demo_tag_row_class(false)).toBe('px-6 pb-6')
	})
})
