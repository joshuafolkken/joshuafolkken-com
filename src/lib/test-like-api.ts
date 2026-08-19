import { HTTP_HEADERS } from '$lib/constants/http'

// Shared by the like-API E2E specs, which both have to satisfy `validate_custom_header` before the
// endpoint answers anything real.
//
// `CLIENT_ID` mirrors `APP.ID` and is kept in step by hand rather than imported: `$lib/app` reads
// `import.meta.env`, which is undefined in the plain Node context Playwright runs specs in, so
// importing it here would throw at module load. Without the header the endpoint answers 403.
const LIKE_API = {
	ENDPOINT: '/api/like',
	CLIENT_ID: 'joshuafolkken-com',
} as const

function like_request_headers(extra: Record<string, string> = {}): Record<string, string> {
	return { [HTTP_HEADERS.X_APP_CLIENT]: LIKE_API.CLIENT_ID, ...extra }
}

export { LIKE_API, like_request_headers }
