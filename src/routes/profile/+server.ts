import { redirect } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import type { RequestHandler } from './$types'

const ABOUT_PATH = '/about'

const GET: RequestHandler = () => {
	redirect(HTTP_STATUS.PERMANENT_REDIRECT, ABOUT_PATH)
}

export { GET }
