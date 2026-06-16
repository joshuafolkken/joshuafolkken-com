import { describe, expect, it } from 'vitest'
import { content_quality } from './content-quality'
import { post_length } from './post-length'

describe('post_length.measure', () => {
	it('measures a thin post below the substantial-content threshold', async () => {
		const length = await post_length.measure('first-post')

		expect(content_quality.is_substantial(length)).toBe(false)
	})

	it('measures a long post above the substantial-content threshold', async () => {
		const length = await post_length.measure('mnemecha')

		expect(content_quality.is_substantial(length)).toBe(true)
	})

	it('returns zero for an unknown slug', async () => {
		expect(await post_length.measure('does-not-exist')).toBe(0)
	})
})
