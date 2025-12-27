import { createClient } from '@libsql/client'
import { env } from '$env/dynamic/private'
import { drizzle } from 'drizzle-orm/libsql'
import { schema } from './schema'

const url = env.TURSO_DATABASE_URL
const auth_token = env.TURSO_AUTH_TOKEN

if (url === '') throw new Error('TURSO_DATABASE_URL is not set')
if (auth_token === '') throw new Error('TURSO_AUTH_TOKEN is not set')

const client = createClient({ url, authToken: auth_token }) // eslint-disable-line @typescript-eslint/naming-convention
const database = drizzle(client, { schema })

export { database }
