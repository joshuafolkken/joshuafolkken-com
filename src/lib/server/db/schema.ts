import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Drizzle Kit がテーブルを検出するには直接エクスポートが必要
// eslint-disable-next-line no-restricted-syntax -- Drizzle Kit 互換のため
export const likes = sqliteTable('likes', {
	slug: text('slug').primaryKey(),
	count: integer('count').default(0).notNull(),
	updated_at: integer('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const schema = {
	likes,
}
