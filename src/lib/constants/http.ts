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
	TOO_MANY_REQUESTS: 'Too Many Requests',
	INTERNAL_SERVER_ERROR: 'Internal Server Error',
} as const

export const HTTP_HEADERS = {
	X_APP_CLIENT: 'X-App-Client',
	CONTENT_TYPE: 'Content-Type',
} as const
