import 'dotenv/config' // eslint-disable-line import/no-unassigned-import
import { createClient } from '@libsql/client'

const database_url = process.env['TURSO_DATABASE_URL']
const auth_token = process.env['TURSO_AUTH_TOKEN']

if (database_url === undefined || auth_token === undefined) {
	console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env')
	process.exit(1)
}

const client = createClient({
	url: database_url,
	authToken: auth_token, // eslint-disable-line @typescript-eslint/naming-convention
})

console.info('Creating tables...')

try {
	await client.execute(`
            CREATE TABLE IF NOT EXISTS post_likes (
                slug TEXT PRIMARY KEY,
                count INTEGER DEFAULT 0,
                updated_at INTEGER
            )
        `)
	console.info('✅ Table "post_likes" created successfully.')
} catch (error) {
	console.error('❌ Error creating table:', error)
}
