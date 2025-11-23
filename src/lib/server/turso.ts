import { createClient } from '@libsql/client'
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private'

if (TURSO_DATABASE_URL === '' || TURSO_AUTH_TOKEN === '') {
	throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set')
}

const client = createClient({
	url: TURSO_DATABASE_URL,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	authToken: TURSO_AUTH_TOKEN,
})

const turso = {
	client,
}

export { turso }
