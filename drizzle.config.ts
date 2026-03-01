import { defineConfig } from 'drizzle-kit'

const LOCAL_DB_PATH = String(process.env['LOCAL_DB_PATH'] || '')

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle/migrations',
	strict: true,
	...(LOCAL_DB_PATH && {
		dbCredentials: {
			url: `file:${LOCAL_DB_PATH}`,
		},
	}),
})
