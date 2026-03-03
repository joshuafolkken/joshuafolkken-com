import { json } from '@sveltejs/kit'
import { ERROR_MESSAGES, HTTP_STATUS } from '$lib/constants/http'
import { logger } from '$lib/logger'
import { like_store } from '$lib/server/like-store'
import { security } from '$lib/server/security'
import type { RequestHandler } from './$types'

interface LikeRequestBody {
	slug?: string
}

function parse_slug(value: unknown): string | undefined {
	if (typeof value !== 'string' || value.trim().length === 0) {
		return undefined
	}

	return value.trim()
}

async function get_valid_slug(request: Request): Promise<string | undefined> {
	const body: LikeRequestBody = await request.json()
	return parse_slug(body.slug)
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

export const GET: RequestHandler = async ({
	url,
	request,
	getClientAddress: get_client_address,
	platform,
}) => {
	const error_response = security.validate_request_security(request, url, get_client_address())

	if (error_response) return error_response

	const slug = parse_slug(url.searchParams.get('slug'))

	if (!slug) {
		return security.json_error(ERROR_MESSAGES.SLUG_REQUIRED, HTTP_STATUS.BAD_REQUEST)
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
	const error_response = security.validate_request_security(request, url, get_client_address())

	if (error_response) return error_response

	const slug = await get_valid_slug(request)

	if (!slug) {
		return security.json_error(ERROR_MESSAGES.SLUG_REQUIRED, HTTP_STATUS.BAD_REQUEST)
	}

	return await process_like_operation(
		slug,
		platform,
		like_store.increment,
		ERROR_MESSAGES.FAILED_TO_INCREMENT_LIKES,
	)
}
