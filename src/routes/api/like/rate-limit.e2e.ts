import { expect, test, type APIRequestContext } from '@playwright/test'
import { HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import { LIKE_API, like_request_headers } from '$lib/test-like-api'

// `wrangler.jsonc` binds RATE_LIMITER at 4 requests per 60 seconds. Kept as a literal rather than
// imported: the point of this spec is that the deployed binding really blocks at its configured
// number, which a value read from the same place the app reads could not demonstrate.
const RATE_LIMIT = 4
const OVER_LIMIT_REQUEST_COUNT = RATE_LIMIT + 1
// Comfortably past the limit, so a suite-wide bucket could not possibly survive the loop.
const ORDINARY_REQUEST_COUNT = RATE_LIMIT * 3

const LIKE_QUERY = `${LIKE_API.ENDPOINT}?slug=mnemecha`

function request_headers(probe_key?: string): Record<string, string> {
	if (probe_key === undefined) return like_request_headers()

	return like_request_headers({ [HTTP_HEADERS.X_RATE_LIMIT_PROBE]: probe_key })
}

async function collect_statuses(
	request: APIRequestContext,
	count: number,
	probe_key?: string,
): Promise<Array<number>> {
	const statuses: Array<number> = []

	for (let index = 0; index < count; index++) {
		const response = await request.get(LIKE_QUERY, { headers: request_headers(probe_key) })

		statuses.push(response.status())
	}

	return statuses
}

test.describe('like API rate limit', () => {
	// Regression for #824. Every request in an E2E run leaves the same loopback address, so keying
	// the limit on the client IP made the whole suite share one bucket: a single run answered 73
	// requests with 429 instead of the real response, and which tests got through depended on
	// timing. The status alone is asserted here — that a like actually persists is `#823`'s spec.
	test('does not throttle ordinary traffic from the test runner', async ({ request }) => {
		const statuses = await collect_statuses(request, ORDINARY_REQUEST_COUNT)

		expect(statuses).not.toContain(HTTP_STATUS.TOO_MANY_REQUESTS)
	})

	// The protection itself stays verified end to end: a request opts back in with the probe header,
	// whose value becomes the bucket key. A fresh key per run is what makes the first response
	// reliably pass and the last reliably block, including on a Playwright retry.
	test('still blocks a request that opts in past the limit', async ({ request }) => {
		const probe_key = `e2e-rate-limit-probe-${crypto.randomUUID()}`
		const statuses = await collect_statuses(request, OVER_LIMIT_REQUEST_COUNT, probe_key)

		expect(statuses[0]).not.toBe(HTTP_STATUS.TOO_MANY_REQUESTS)
		expect(statuses.at(-1)).toBe(HTTP_STATUS.TOO_MANY_REQUESTS)
	})
})
