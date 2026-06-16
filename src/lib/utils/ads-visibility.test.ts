import { describe, expect, it } from 'vitest'
import { ads_visibility } from './ads-visibility'
import { MIN_SUBSTANTIAL_CONTENT_LENGTH } from './content-quality'

describe('ads_visibility.should_show_ads', () => {
	it('hides ads below the shared content-quality threshold', () => {
		expect(ads_visibility.should_show_ads(MIN_SUBSTANTIAL_CONTENT_LENGTH - 1)).toBe(false)
	})

	it('shows ads at the shared content-quality threshold', () => {
		expect(ads_visibility.should_show_ads(MIN_SUBSTANTIAL_CONTENT_LENGTH)).toBe(true)
	})

	it('shows ads above the shared content-quality threshold', () => {
		expect(ads_visibility.should_show_ads(MIN_SUBSTANTIAL_CONTENT_LENGTH + 1)).toBe(true)
	})
})
