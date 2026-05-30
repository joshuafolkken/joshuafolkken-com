import { describe, expect, it } from 'vitest'
import { ads_visibility, MIN_CONTENT_LENGTH_FOR_ADS } from './ads-visibility'

describe('ads_visibility.should_show_ads', () => {
	it('hides ads below the threshold', () => {
		expect(ads_visibility.should_show_ads(MIN_CONTENT_LENGTH_FOR_ADS - 1)).toBe(false)
	})

	it('shows ads at the threshold', () => {
		expect(ads_visibility.should_show_ads(MIN_CONTENT_LENGTH_FOR_ADS)).toBe(true)
	})

	it('shows ads above the threshold', () => {
		expect(ads_visibility.should_show_ads(MIN_CONTENT_LENGTH_FOR_ADS + 1)).toBe(true)
	})
})
