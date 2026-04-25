import { redirect } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import type { RequestHandler } from './$types'

const PRIVACY_PATH = '/privacy'

const GET: RequestHandler = () => {
	redirect(HTTP_STATUS.PERMANENT_REDIRECT, PRIVACY_PATH)
}

export { GET }
