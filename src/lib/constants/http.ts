export const HTTP_STATUS = {
	OK: 200,
	BAD_REQUEST: 400,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	TOO_MANY_REQUESTS: 429,
	INTERNAL_SERVER_ERROR: 500,
} as const

export const ERROR_MESSAGES = {
	FORBIDDEN: 'Forbidden',
	NOT_FOUND: 'Page not found',
	TOO_MANY_REQUESTS: 'Too Many Requests',
	INTERNAL_SERVER_ERROR: 'Internal Server Error',
	SLUG_REQUIRED: 'Slug is required',
	SLUG_INVALID: 'Slug format is invalid',
	INVALID_CONTENT_TYPE: 'Content-Type must be application/json',
	FAILED_TO_FETCH_CONTRIBUTORS: 'Failed to fetch contributors',
	FAILED_TO_GET_LIKES: 'Failed to get likes',
	FAILED_TO_INCREMENT_LIKES: 'Failed to increment likes',
} as const

export const HTTP_HEADERS = {
	CACHE_CONTROL: 'Cache-Control',
	CONTENT_TYPE: 'Content-Type',
	ORIGIN: 'origin',
	X_APP_CLIENT: 'X-App-Client',
} as const

export const CONTENT_TYPE_JSON = 'application/json' as const
export const CONTENT_TYPE_XML = 'application/xml' as const
