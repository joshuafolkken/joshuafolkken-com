import { createClient } from '@libsql/client'
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private'
import { drizzle } from 'drizzle-orm/libsql'
import { post_likes } from './schema'

const client = createClient({
	url: TURSO_DATABASE_URL,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	authToken: TURSO_AUTH_TOKEN,
})

const database = drizzle(client, { schema: { post_likes } })

export { database }
