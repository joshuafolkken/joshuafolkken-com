/* eslint-disable @typescript-eslint/triple-slash-reference -- tsgo needs explicit reference for Cloudflare types */
/// <reference path="../../../worker-configuration.d.ts" />
import { json } from '@sveltejs/kit'
import { APP } from '$lib/app'
import { ERROR_MESSAGES, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import {
	CSP_VALUE,
	HSTS_VALUE,
	LOCALHOST_HOSTNAMES,
	PERMISSIONS_POLICY_VALUE,
} from '$lib/constants/security'
import { logger } from '$lib/logger'
import { platform_binding } from '$lib/server/platform-binding'
import {
	validator_chain,
	type ValidationResult,
	type ValidatorFunction,
} from '$lib/server/validator-chain'

interface SecurityContext {
	request: Request
	url: URL
	ip: string
	platform: App.Platform | undefined
}

function add_security_headers(response: Response): void {
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('X-Frame-Options', 'SAMEORIGIN')
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
	response.headers.set('Strict-Transport-Security', HSTS_VALUE)
	response.headers.set('Permissions-Policy', PERMISSIONS_POLICY_VALUE)
	response.headers.set('Content-Security-Policy', CSP_VALUE)
}

function json_error(message: string, status: number): Response {
	return json({ error: message }, { status })
}

async function check_rate_limit(
	platform: App.Platform | undefined,
	ip: string,
): Promise<ValidationResult> {
	if (!platform) return undefined

	const { success: is_allowed } = await platform_binding
		.get_rate_limiter(platform)
		.limit({ key: ip })

	if (!is_allowed) {
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

const VALIDATORS: ReadonlyArray<ValidatorFunction> = [validate_custom_header, validate_origin]

async function validate_request_security(context: SecurityContext): Promise<ValidationResult> {
	const { request, url, ip, platform } = context

	const rate_limit_error = await check_rate_limit(platform, ip)
	if (rate_limit_error) return rate_limit_error

	return validator_chain.run_validators(VALIDATORS, request, url, ip)
}

export type { SecurityContext }
export const security = {
	add_security_headers,
	json_error,
	validate_request_security,
}
