import { describe, expect, it } from 'vitest'
import { post_length } from './post-length'

// Two posts far enough apart in length that no plausible edit reorders them: `mnemecha` is the
// longest post on the site by a wide margin. Asserting the relative order proves `measure` reads
// the post it was named rather than returning a constant, without pinning either post to a length.
const SHORT_SLUG = 'first-post'
const LONG_SLUG = 'mnemecha'

// Where the threshold itself is verified: `content-quality.test.ts` covers below / at / above with
// plain numbers. This file deliberately does not repeat that — an earlier version asserted that a
// named post fell below the threshold, which made an editorial decision (how long an article is)
// into a build failure the moment that article was expanded.
describe('post_length.measure', () => {
	it('returns a positive length for a post that exists', async () => {
		expect(await post_length.measure(SHORT_SLUG)).toBeGreaterThan(0)
	})

	it('measures the post it is given rather than any post', async () => {
		const short_length = await post_length.measure(SHORT_SLUG)
		const long_length = await post_length.measure(LONG_SLUG)

		expect(long_length).toBeGreaterThan(short_length)
	})

	it('returns zero for an unknown slug', async () => {
		expect(await post_length.measure('does-not-exist')).toBe(0)
	})
})
