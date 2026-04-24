import { json } from '@sveltejs/kit'
import { CONTENT_TYPE_JSON, ERROR_MESSAGES, HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import { logger } from '$lib/logger'
import { like_store } from '$lib/server/like-store'
import { security, type SecurityContext } from '$lib/server/security'
import { slug_validator } from '$lib/utils/slug-validator'
import type { RequestHandler } from './$types'

interface LikeRequestBody {
	slug?: string
}

function is_json_content_type(request: Request): boolean {
	const content_type = request.headers.get(HTTP_HEADERS.CONTENT_TYPE)

	return content_type?.startsWith(CONTENT_TYPE_JSON) ?? false
}

async function get_valid_slug(request: Request): Promise<string | undefined> {
	if (!is_json_content_type(request)) {
		return undefined
	}

	try {
		/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- request.json() returns unknown */
		const body = (await request.json()) as LikeRequestBody

		return slug_validator.parse_slug(body.slug)
	} catch {
		return undefined
	}
}

function json_likes(likes: number): Response {
	return json({ likes })
}

type LikeOperation = (slug: string, platform: App.Platform | undefined) => Promise<number>

async function process_like_operation(
	slug: string,
	platform: App.Platform | undefined,
	operation: LikeOperation,
	error_message: string,
): Promise<Response> {
	try {
		const likes = await operation(slug, platform)

		return json_likes(likes)
	} catch (error) {
		logger.error(error)

		return security.json_error(error_message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
	}
}

function get_slug_error_message(raw_slug: string | null): string {
	return slug_validator.is_slug_missing(raw_slug)
		? ERROR_MESSAGES.SLUG_REQUIRED
		: ERROR_MESSAGES.SLUG_INVALID
}

function get_post_slug_error_message(request: Request): string {
	return is_json_content_type(request)
		? ERROR_MESSAGES.SLUG_INVALID
		: ERROR_MESSAGES.INVALID_CONTENT_TYPE
}

export const GET: RequestHandler = async ({
	url,
	request,
	getClientAddress: get_client_address,
	platform,
}) => {
	const context: SecurityContext = { request, url, ip: get_client_address(), platform }
	const error_response = await security.validate_request_security(context)

	if (error_response) return error_response

	const raw_slug = url.searchParams.get('slug')
	const slug = slug_validator.parse_slug(raw_slug)

	if (!slug) {
		return security.json_error(get_slug_error_message(raw_slug), HTTP_STATUS.BAD_REQUEST)
	}

	return await process_like_operation(
		slug,
		platform,
		like_store.get,
		ERROR_MESSAGES.FAILED_TO_GET_LIKES,
	)
}

export const POST: RequestHandler = async ({
	request,
	getClientAddress: get_client_address,
	url,
	platform,
}) => {
	const context: SecurityContext = { request, url, ip: get_client_address(), platform }
	const error_response = await security.validate_request_security(context)

	if (error_response) return error_response

	const slug = await get_valid_slug(request)

	if (!slug) {
		return security.json_error(get_post_slug_error_message(request), HTTP_STATUS.BAD_REQUEST)
	}

	return await process_like_operation(
		slug,
		platform,
		like_store.increment,
		ERROR_MESSAGES.FAILED_TO_INCREMENT_LIKES,
	)
}
