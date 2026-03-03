import { json } from '@sveltejs/kit'
import { ERROR_MESSAGES, HTTP_STATUS } from '$lib/constants/http'
import { logger } from '$lib/logger'
import { like_store } from '$lib/server/like-store'
import { security } from '$lib/server/security'
import type { RequestHandler } from './$types'

interface LikeRequestBody {
	slug?: string
}

async function get_valid_slug(request: Request): Promise<string | undefined> {
	const body: LikeRequestBody = await request.json()
	const { slug } = body

	if (slug === undefined || slug === '') {
		return undefined
	}

	return slug
}

function json_likes(likes: number): Response {
	return json({ likes })
}

async function process_get_likes(
	slug: string,
	platform: App.Platform | undefined,
): Promise<Response> {
	try {
		const likes = await like_store.get(slug, platform)
		return json_likes(likes)
	} catch (error) {
		logger.error(error)
		return security.json_error(
			ERROR_MESSAGES.FAILED_TO_GET_LIKES,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
		)
	}
}

async function process_like_increment(
	slug: string,
	platform: App.Platform | undefined,
): Promise<Response> {
	try {
		const likes = await like_store.increment(slug, platform)
		return json_likes(likes)
	} catch (error) {
		logger.error(error)
		return security.json_error(
			ERROR_MESSAGES.FAILED_TO_INCREMENT_LIKES,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
		)
	}
}

export const GET: RequestHandler = async ({
	url,
	request,
	getClientAddress: get_client_address,
	platform,
}) => {
	const error_response = security.validate_request_security(request, url, get_client_address())

	if (error_response !== undefined) {
		return error_response
	}

	const slug = url.searchParams.get('slug')

	if (slug === null || slug === '') {
		return security.json_error(ERROR_MESSAGES.SLUG_REQUIRED, HTTP_STATUS.BAD_REQUEST)
	}

	return await process_get_likes(slug, platform)
}

export const POST: RequestHandler = async ({
	request,
	getClientAddress: get_client_address,
	url,
	platform,
}) => {
	const error_response = security.validate_request_security(request, url, get_client_address())

	if (error_response !== undefined) {
		return error_response
	}

	const slug = await get_valid_slug(request)

	if (slug === undefined) {
		return security.json_error(ERROR_MESSAGES.SLUG_REQUIRED, HTTP_STATUS.BAD_REQUEST)
	}

	return await process_like_increment(slug, platform)
}
