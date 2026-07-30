/* eslint-disable @typescript-eslint/triple-slash-reference -- tsgo needs explicit reference for Cloudflare types */
/// <reference path="../../../worker-configuration.d.ts" />
import { security_headers } from '@joshuafolkken/app-kit/security'
import { json } from '@sveltejs/kit'
import { APP } from '$lib/app'
import { CONTENT_TYPE, ERROR_MESSAGES, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import { HSTS_VALUE, LOCALHOST_HOSTNAMES, PERMISSIONS_POLICY_VALUE } from '$lib/constants/security'
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
	// Baseline (nosniff, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy) is
	// single-sourced from app-kit; `extra` layers this site's SSR-only headers on top
	// (last-write-wins), overriding Permissions-Policy with the stricter payment=() value.
	//
	// Content-Security-Policy is deliberately absent: SvelteKit emits it per rendered page from
	// `kit.csp` (svelte.config.js) with the per-request nonce baked in. Setting it here would
	// overwrite that header with a nonce-less copy and block every inline script on the page.
	security_headers.apply_security_headers(response, [
		['Permissions-Policy', PERMISSIONS_POLICY_VALUE],
		['Strict-Transport-Security', HSTS_VALUE],
	])
}

function json_error(message: string, status: number): Response {
	return json({ error: message }, { status })
}

function is_json_content_type(request: Request): boolean {
	const content_type = request.headers.get(HTTP_HEADERS.CONTENT_TYPE)

	return content_type?.startsWith(CONTENT_TYPE.JSON) ?? false
}

function try_get_rate_limiter(platform: App.Platform): RateLimit | undefined {
	try {
		return platform_binding.get_rate_limiter(platform)
	} catch (error) {
		logger.error(`[RateLimit] Binding unavailable, skipping rate limit: ${String(error)}`)

		return undefined
	}
}

async function check_rate_limit(
	platform: App.Platform | undefined,
	ip: string,
): Promise<ValidationResult> {
	if (!platform) return undefined

	const rate_limiter = try_get_rate_limiter(platform)
	if (!rate_limiter) return undefined

	const { success: is_allowed } = await rate_limiter.limit({ key: ip })

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
	is_json_content_type,
	validate_request_security,
}
