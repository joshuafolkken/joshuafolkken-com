import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/* eslint-disable no-restricted-syntax */
export const post_likes = sqliteTable('post_likes', {
	slug: text('slug').primaryKey(),
	count: integer('count').default(0).notNull(),
	updated_at: integer('updated_at').default(sql`CURRENT_TIMESTAMP`),
})
