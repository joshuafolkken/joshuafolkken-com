/* eslint-disable @typescript-eslint/triple-slash-reference -- tsgo needs explicit reference for Cloudflare types */
/// <reference path="../../../worker-configuration.d.ts" />
import { security_headers } from '@joshuafolkken/app-kit/security'
import { json } from '@sveltejs/kit'
import { APP } from '$lib/app'
import { CONTENT_TYPE, ERROR_MESSAGES, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import {
	LOCALHOST_HOSTNAMES,
	LOOPBACK_ADDRESSES,
	SECURITY_HEADERS_EXTRA,
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
	// Baseline (nosniff, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy) is
	// single-sourced from app-kit; SECURITY_HEADERS_EXTRA layers this site's SSR-only headers on top
	// (last-write-wins), overriding Permissions-Policy with the stricter payment=() value. The same
	// array is handed to `baseline_problems` in `security-headers.e2e.ts`, so what is served and what
	// is asserted come from one place.
	//
	// Content-Security-Policy is deliberately absent: SvelteKit emits it per rendered page from
	// `kit.csp` (svelte.config.js) with the per-request nonce baked in. Setting it here would
	// overwrite that header with a nonce-less copy and block every inline script on the page.
	security_headers.apply_security_headers(response, SECURITY_HEADERS_EXTRA)
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

// Which bucket this request counts against, or `undefined` to skip the limit entirely.
//
// Under the E2E preview server every request arrives from one loopback address, so the whole suite
// shared a single 4-requests-per-60-seconds bucket: one run answered 73 requests with 429 instead
// of the real response, which made a test pass or fail on timing rather than on the code under
// test (#824). The limit is therefore keyed only for traffic that reached this Worker over the
// network, and `LOOPBACK_ADDRESSES` explains why a local run cannot forge that.
//
// The request hostname looks like the obvious switch and is not one: `wrangler dev --local`
// reproduces the `routes` entry in `wrangler.jsonc`, so the preview server hands the Worker the
// `joshuafolkken.com` hostname even though the browser asked for `localhost:4173`. Reading
// `url.hostname` here would therefore take the production branch in exactly the run this exists
// for.
//
// Enforcement is not simply dropped locally. A loopback request opts back in by sending
// X-Rate-Limit-Probe, and the header's value becomes the bucket key, so `rate-limit.e2e.ts` can
// prove the configured limit end to end against a bucket that no other test shares and no rerun
// inherits.
function resolve_rate_limit_key(request: Request, ip: string): string | undefined {
	if (!LOOPBACK_ADDRESSES.has(ip)) return ip

	const probe_key = request.headers.get(HTTP_HEADERS.X_RATE_LIMIT_PROBE)

	return probe_key === null || probe_key.length === 0 ? undefined : probe_key
}

async function check_rate_limit(platform: App.Platform, key: string): Promise<ValidationResult> {
	const rate_limiter = try_get_rate_limiter(platform)
	if (!rate_limiter) return undefined

	const { success: is_allowed } = await rate_limiter.limit({ key })
	if (is_allowed) return undefined

	logger.warn(`[RateLimit] Blocked request from ${key}`)

	return json_error(ERROR_MESSAGES.TOO_MANY_REQUESTS, HTTP_STATUS.TOO_MANY_REQUESTS)
}

async function enforce_rate_limit(context: SecurityContext): Promise<ValidationResult> {
	const { request, ip, platform } = context

	if (!platform) return undefined

	const key = resolve_rate_limit_key(request, ip)
	if (key === undefined) return undefined

	return await check_rate_limit(platform, key)
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
	const { request, url, ip } = context

	const rate_limit_error = await enforce_rate_limit(context)
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
