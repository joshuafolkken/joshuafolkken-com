import { json } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import { like_store } from '$lib/server/like-store'
import { security } from '$lib/server/security'
import type { RequestHandler } from './$types'

const ERROR_SLUG_REQUIRED = 'Slug is required'

interface LikeRequestBody {
	slug?: string
}

async function get_valid_slug(request: Request): Promise<string | undefined> {
	const body = (await request.json()) as LikeRequestBody
	const { slug } = body
	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (!slug) return undefined
	return slug
}

function json_likes(likes: number): Response {
	return json({ likes })
}

async function process_get_likes(slug: string): Promise<Response> {
	try {
		const likes = await like_store.get_likes(slug)
		return json_likes(likes)
	} catch (error) {
		console.error(error)
		return security.json_error('Failed to get likes', HTTP_STATUS.INTERNAL_SERVER_ERROR)
	}
}

async function process_like_increment(slug: string): Promise<Response> {
	try {
		await like_store.increment_likes(slug)
		const likes = await like_store.get_likes(slug)
		return json_likes(likes)
	} catch (error) {
		console.error(error)
		return security.json_error('Failed to increment likes', HTTP_STATUS.INTERNAL_SERVER_ERROR)
	}
}

export const GET: RequestHandler = async ({
	url,
	request,
	getClientAddress: get_client_address,
}) => {
	const error_response = security.validate_request_security(request, url, get_client_address())
	if (error_response !== undefined) {
		return error_response
	}

	const slug = url.searchParams.get('slug')

	if (slug === null || slug === '') {
		return security.json_error(ERROR_SLUG_REQUIRED, HTTP_STATUS.BAD_REQUEST)
	}

	return await process_get_likes(slug)
}

export const POST: RequestHandler = async ({
	request,
	getClientAddress: get_client_address,
	url,
}) => {
	const error_response = security.validate_request_security(request, url, get_client_address())
	if (error_response !== undefined) {
		return error_response
	}

	const slug = await get_valid_slug(request)
	if (slug === undefined) {
		return security.json_error(ERROR_SLUG_REQUIRED, HTTP_STATUS.BAD_REQUEST)
	}

	return await process_like_increment(slug)
}
