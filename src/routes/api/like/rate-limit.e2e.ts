import { expect, test, type APIRequestContext } from '@playwright/test'
import { HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'

// `wrangler.jsonc` binds RATE_LIMITER at 4 requests per 60 seconds. Kept as a literal rather than
// imported: the point of this spec is that the deployed binding really blocks at its configured
// number, which a value read from the same place the app reads could not demonstrate.
const RATE_LIMIT = 4
const OVER_LIMIT_REQUEST_COUNT = RATE_LIMIT + 1
// Comfortably past the limit, so a suite-wide bucket could not possibly survive the loop.
const ORDINARY_REQUEST_COUNT = RATE_LIMIT * 3

// The value `validate_custom_header` expects, kept in step with `APP.ID` by hand as
// `security.test.ts` does: `$lib/app` reads `import.meta.env`, which is undefined in the plain Node
// context Playwright runs specs in, so importing it here would throw at module load. Without the
// header the endpoint answers 403 — still not 429, which would weaken what the first test proves.
const APP_CLIENT_ID = 'joshuafolkken-com'
const LIKE_ENDPOINT = '/api/like?slug=mnemecha'

function app_headers(probe_key?: string): Record<string, string> {
	const headers: Record<string, string> = { [HTTP_HEADERS.X_APP_CLIENT]: APP_CLIENT_ID }

	if (probe_key !== undefined) headers[HTTP_HEADERS.X_RATE_LIMIT_PROBE] = probe_key

	return headers
}

async function collect_statuses(
	request: APIRequestContext,
	count: number,
	probe_key?: string,
): Promise<Array<number>> {
	const statuses: Array<number> = []

	for (let index = 0; index < count; index++) {
		const response = await request.get(LIKE_ENDPOINT, { headers: app_headers(probe_key) })

		statuses.push(response.status())
	}

	return statuses
}

test.describe('like API rate limit', () => {
	// Regression for #824. Every request in an E2E run leaves the same loopback address, so keying
	// the limit on the client IP made the whole suite share one bucket: a single run answered 73
	// requests with 429 instead of the real response, and which tests got through depended on
	// timing. The status is asserted rather than the body because the local D1 has no schema until
	// #823 lands — a 500 from the database still proves the request was not throttled.
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
