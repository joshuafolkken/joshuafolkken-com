import { json } from '@sveltejs/kit'
import { APP } from '$lib/app'
import { ERROR_MESSAGES, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'

const ONE_MINUTE_SECONDS = 60
const ONE_SECOND_MS = 1000
const LIMIT_WINDOW = ONE_MINUTE_SECONDS * ONE_SECOND_MS
const LIMIT_COUNT = 60

interface LimitData {
	count: number
	reset_at: number
}

const ip_limits = new Map<string, LimitData>()

const cleanup_interval = setInterval(() => {
	const now = Date.now()

	for (const [ip, data] of ip_limits.entries()) {
		if (now > data.reset_at) {
			ip_limits.delete(ip)
		}
	}
}, LIMIT_WINDOW)

if (typeof process !== 'undefined') {
	process.on('exit', () => {
		clearInterval(cleanup_interval)
	})
}

function check_rate_limit(ip: string): boolean {
	const now = Date.now()
	let limit_data = ip_limits.get(ip)

	if (limit_data === undefined || now > limit_data.reset_at) {
		limit_data = { count: 0, reset_at: now + LIMIT_WINDOW }
		ip_limits.set(ip, limit_data)
	}

	if (limit_data.count >= LIMIT_COUNT) {
		return false
	}

	limit_data.count += 1
	return true
}

function json_error(message: string, status: number): Response {
	return json({ error: message }, { status })
}

function validate_rate_limit(ip: string): Response | undefined {
	if (!check_rate_limit(ip)) {
		console.warn(`[RateLimit] Blocked request from ${ip}`)
		return json_error(ERROR_MESSAGES.TOO_MANY_REQUESTS, HTTP_STATUS.TOO_MANY_REQUESTS)
	}

	return undefined
}

function validate_custom_header(request: Request): Response | undefined {
	const client_header = request.headers.get(HTTP_HEADERS.X_APP_CLIENT)

	if (client_header !== APP.ID) {
		console.warn(`[HeaderCheck] Blocked request with invalid header: ${client_header ?? 'null'}`)
		return json_error(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
	}

	return undefined
}

function validate_origin(request: Request, url: URL): Response | undefined {
	const origin = request.headers.get('origin')

	// originが存在し、かつ現在のサイトのオリジンと一致しない場合は不正
	if (origin !== null && new URL(origin).origin !== url.origin) {
		console.warn(`[OriginCheck] Blocked request from origin: ${origin}`)
		return json_error(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
	}

	return undefined
}

function validate_request_security(request: Request, url: URL, ip: string): Response | undefined {
	return validate_rate_limit(ip) ?? validate_custom_header(request) ?? validate_origin(request, url)
}

export const security = {
	validate_request_security,
	json_error,
}
