import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const PERMANENT_REDIRECT_STATUS = 308
const ABOUT_PATH = '/about'

const GET: RequestHandler = () => {
	redirect(PERMANENT_REDIRECT_STATUS, ABOUT_PATH)
}

export { GET }
