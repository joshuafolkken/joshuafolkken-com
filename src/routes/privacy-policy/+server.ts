import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const PERMANENT_REDIRECT_STATUS = 308
const PRIVACY_PATH = '/privacy'

const GET: RequestHandler = () => {
	redirect(PERMANENT_REDIRECT_STATUS, PRIVACY_PATH)
}

export { GET }
