import { json } from '@sveltejs/kit'
import { APP } from '$lib/app'
import { ERROR_MESSAGES, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import { logger } from '$lib/logger'
import { time_conversion } from '$lib/time-conversion'

const LIMIT_WINDOW = time_conversion.minutes_to_ms(1)

const LOCALHOST_HOSTNAMES = new Set(['localhost', '127.0.0.1'])

function add_security_headers(response: Response): void {
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('X-Frame-Options', 'SAMEORIGIN')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
}

const LIMIT_COUNT = 60

interface LimitData {
	count: number
	reset_at: number
}

const ip_limits = new Map<string, LimitData>()

function cleanup_expired_limits(): void {
	const now = Date.now()

	for (const [ip, data] of ip_limits.entries()) {
		if (now > data.reset_at) {
			ip_limits.delete(ip)
		}
	}
}

function check_rate_limit(ip: string): boolean {
	cleanup_expired_limits()
	const now = Date.now()
	let limit_data = ip_limits.get(ip)

	if (!limit_data || now > limit_data.reset_at) {
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

type ValidationResult = Response | undefined

function validate_rate_limit(ip: string): ValidationResult {
	if (!check_rate_limit(ip)) {
		logger.warn(`[RateLimit] Blocked request from ${ip}`)
		return json_error(ERROR_MESSAGES.TOO_MANY_REQUESTS, HTTP_STATUS.TOO_MANY_REQUESTS)
	}

	return undefined
}

function validate_custom_header(request: Request): ValidationResult {
	const client_header = request.headers.get(HTTP_HEADERS.X_APP_CLIENT)

	if (client_header !== APP.ID) {
		logger.warn(`[HeaderCheck] Blocked request with invalid header: ${client_header ?? 'null'}`)
		return json_error(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
	}

	return undefined
}

function is_localhost_hostname(hostname: string): boolean {
	return LOCALHOST_HOSTNAMES.has(hostname)
}

function check_development_localhost(origin_url: URL): boolean {
	// Treat localhost origin as development environment (wrangler dev, Vite dev, etc.)
	// Production typically does not receive localhost requests
	return is_localhost_hostname(origin_url.hostname)
}

function parse_origin_url(origin: string): URL | undefined {
	try {
		return new URL(origin)
	} catch {
		return undefined
	}
}

function is_origin_mismatch(origin_url: URL, url: URL): boolean {
	return origin_url.origin !== url.origin
}

function block_origin(origin: string): ValidationResult {
	logger.warn(`[OriginCheck] Blocked request from origin: ${origin}`)
	return json_error(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
}

function validate_origin(request: Request, url: URL): ValidationResult {
	const origin = request.headers.get(HTTP_HEADERS.ORIGIN)

	if (!origin) return undefined

	const origin_url = parse_origin_url(origin)
	if (!origin_url) return block_origin(origin)

	if (check_development_localhost(origin_url)) return undefined
	if (is_origin_mismatch(origin_url, url)) return block_origin(origin)

	return undefined
}

function validate_request_security(request: Request, url: URL, ip: string): ValidationResult {
	return validate_rate_limit(ip) ?? validate_custom_header(request) ?? validate_origin(request, url)
}

export const security = {
	add_security_headers,
	json_error,
	validate_request_security,
}
