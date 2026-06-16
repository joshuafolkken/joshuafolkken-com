import { describe, expect, it } from 'vitest'
import { content_quality, MIN_SUBSTANTIAL_CONTENT_LENGTH } from './content-quality'

describe('content_quality.is_substantial', () => {
	it('treats content below the threshold as not substantial', () => {
		expect(content_quality.is_substantial(MIN_SUBSTANTIAL_CONTENT_LENGTH - 1)).toBe(false)
	})

	it('treats content at the threshold as substantial', () => {
		expect(content_quality.is_substantial(MIN_SUBSTANTIAL_CONTENT_LENGTH)).toBe(true)
	})

	it('treats content above the threshold as substantial', () => {
		expect(content_quality.is_substantial(MIN_SUBSTANTIAL_CONTENT_LENGTH + 1)).toBe(true)
	})
})
