import { createClient } from '@libsql/client'
import { env } from '$env/dynamic/private'
import { drizzle } from 'drizzle-orm/libsql'
import { schema } from './schema'

let database_instance: ReturnType<typeof drizzle> | undefined // eslint-disable-line init-declarations

function create_database(): ReturnType<typeof drizzle> {
	const url = env.TURSO_DATABASE_URL
	const auth_token = env.TURSO_AUTH_TOKEN

	if (url === '') throw new Error('TURSO_DATABASE_URL is not set')
	if (auth_token === '') throw new Error('TURSO_AUTH_TOKEN is not set')

	const client = createClient({ url, authToken: auth_token }) // eslint-disable-line @typescript-eslint/naming-convention
	return drizzle(client, { schema })
}

function get_instance(): ReturnType<typeof drizzle> {
	database_instance ??= create_database()

	return database_instance
}

export const database = {
	get_instance: (): ReturnType<typeof drizzle> => get_instance(),
}
