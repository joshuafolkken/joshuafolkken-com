import { json } from '@sveltejs/kit'
import { APP } from '$lib/app'
import { ERROR_MESSAGES, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import {
	LOCALHOST_HOSTNAMES,
	RATE_LIMIT_COUNT,
	RATE_LIMIT_WINDOW_MS,
} from '$lib/constants/security'
import { logger } from '$lib/logger'
import {
	validator_chain,
	type ValidationResult,
	type ValidatorFunction,
} from '$lib/server/validator-chain'

function add_security_headers(response: Response): void {
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('X-Frame-Options', 'SAMEORIGIN')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
}

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
		limit_data = { count: 0, reset_at: now + RATE_LIMIT_WINDOW_MS }
		ip_limits.set(ip, limit_data)
	}

	if (limit_data.count >= RATE_LIMIT_COUNT) {
		return false
	}

	limit_data.count += 1

	return true
}

function json_error(message: string, status: number): Response {
	return json({ error: message }, { status })
}

function validate_rate_limit(_request: Request, _url: URL, ip: string): ValidationResult {
	if (!check_rate_limit(ip)) {
		logger.warn(`[RateLimit] Blocked request from ${ip}`)

		return json_error(ERROR_MESSAGES.TOO_MANY_REQUESTS, HTTP_STATUS.TOO_MANY_REQUESTS)
	}

	return undefined
}

function validate_custom_header(request: Request, _url: URL, _ip: string): ValidationResult {
	const client_header = request.headers.get(HTTP_HEADERS.X_APP_CLIENT)

	if (client_header !== APP.ID) {
		logger.warn(`[HeaderCheck] Blocked request with invalid header: ${client_header ?? 'null'}`)

		return json_error(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
	}

	return undefined
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

function validate_origin(request: Request, url: URL, _ip: string): ValidationResult {
	const origin = request.headers.get(HTTP_HEADERS.ORIGIN)

	if (!origin) return undefined

	const origin_url = parse_origin_url(origin)
	if (!origin_url) return block_origin(origin)

	if (LOCALHOST_HOSTNAMES.has(origin_url.hostname)) return undefined
	if (is_origin_mismatch(origin_url, url)) return block_origin(origin)

	return undefined
}

const VALIDATORS: ReadonlyArray<ValidatorFunction> = [
	validate_rate_limit,
	validate_custom_header,
	validate_origin,
]

function validate_request_security(request: Request, url: URL, ip: string): ValidationResult {
	return validator_chain.run_validators(VALIDATORS, request, url, ip)
}

export const security = {
	add_security_headers,
	json_error,
	validate_request_security,
}
