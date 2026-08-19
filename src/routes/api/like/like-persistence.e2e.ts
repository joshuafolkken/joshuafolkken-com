import { expect, test } from '@playwright/test'
import { CONTENT_TYPE, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import { LIKE_API, like_request_headers } from '$lib/test-like-api'

// Regression for #823, and the only guard on the `prepreview` script in `package.json` — a hook
// that cannot document itself, because JSON takes no comments.
//
// The E2E preview server runs `wrangler dev … --local`, which creates an empty local D1 every time
// CI checks out the repository. Nothing applied `drizzle/migrations` to it, so the `likes` table
// never existed: the read path caught `no such table` and returned 0 (`like-store.ts`), which is
// indistinguishable from a real zero, and one run logged 204 of those failures — the noise that
// buried the preview-server crash in #825. `prepreview` now applies the migrations before the
// server accepts its first request. It is a pnpm pre-hook rather than a change to `preview`
// itself, because `preview` is distributed by app-kit and `josh sync` would revert an edit to it.
//
// Asserting the count rather than a 200 is what makes this test load-bearing: the read fallback
// answers 200 with `{ likes: 0 }`, so a status-only assertion on the read would pass against the
// broken database this exists to detect. The write path is the sharper signal — `increment`
// rethrows instead of falling back, so a schemaless database fails the first POST with a 500,
// which is exactly what this spec was observed to do before the hook existed.
const COUNT_AFTER_FIRST_LIKE = 1
const COUNT_AFTER_SECOND_LIKE = 2

function json_headers(): Record<string, string> {
	return like_request_headers({ [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON })
}

test.describe('like persistence', () => {
	test('stores each like and reads the stored count back', async ({ request }) => {
		// A slug no other run has used, so the expected counts are exact even on a Playwright retry
		// or a second worker.
		const slug = `e2e-like-${crypto.randomUUID()}`
		const options = { headers: json_headers(), data: { slug } }

		const first = await request.post(LIKE_API.ENDPOINT, options)
		const second = await request.post(LIKE_API.ENDPOINT, options)
		const read = await request.get(`${LIKE_API.ENDPOINT}?slug=${slug}`, {
			headers: like_request_headers(),
		})

		expect(first.status()).toBe(HTTP_STATUS.OK)
		expect(await first.json()).toEqual({ likes: COUNT_AFTER_FIRST_LIKE })
		expect(await second.json()).toEqual({ likes: COUNT_AFTER_SECOND_LIKE })
		// The read goes through the KV cache, which `increment` invalidates — so this is a fresh
		// database round trip, not the value the write path just returned.
		expect(await read.json()).toEqual({ likes: COUNT_AFTER_SECOND_LIKE })
	})
})
