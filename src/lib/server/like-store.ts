import { logger } from '$lib/logger'
import { eq, sql } from 'drizzle-orm'
import { database } from './db'
import { post_likes } from './db/schema'
import { kv_cache } from './kv-cache'

const INITIAL_COUNT = 0
const INCREMENT_VALUE = 1
const CACHE_KEY_PREFIX = 'like:'

function get_cache_key(slug: string): string {
	return `${CACHE_KEY_PREFIX}${slug}`
}

async function get_likes_from_database(slug: string): Promise<number> {
	const database_instance = database.get_instance()
	const result = await database_instance
		.select()
		.from(post_likes)
		.where(eq(post_likes.slug, slug))
		.limit(1)

	return result[0]?.count ?? INITIAL_COUNT
}

async function update_likes_in_database(slug: string): Promise<void> {
	const now = Date.now()
	const database_instance = database.get_instance()

	await database_instance
		.insert(post_likes)
		.values({
			slug,
			count: INCREMENT_VALUE,
			updated_at: now,
		})
		.onConflictDoUpdate({
			target: post_likes.slug,
			set: {
				count: sql`${post_likes.count} + ${INCREMENT_VALUE}`,
				updated_at: now,
			},
		})
}

async function get_likes(slug: string, platform: App.Platform | undefined): Promise<number> {
	const cache_key = get_cache_key(slug)

	try {
		return await kv_cache.get(
			cache_key,
			async () => {
				return await get_likes_from_database(slug)
			},
			platform,
		)
	} catch (error) {
		logger.error('Failed to fetch likes from DB:', error)
		return INITIAL_COUNT
	}
}

async function increment_likes(slug: string, platform: App.Platform | undefined): Promise<number> {
	logger.debug(`[like-store] Incrementing likes for slug: "${slug}"`)

	try {
		await update_likes_in_database(slug)
		const cache_key = get_cache_key(slug)
		await kv_cache.delete(cache_key, platform)

		// キャッシュを再取得（データベースから最新値を取得）
		const count = await get_likes(slug, platform)
		logger.debug(`[like-store] New count after increment: ${String(count)}`)
		return count
	} catch (error) {
		logger.error('Failed to increment likes:', error)
		throw error
	}
}

const like_store = {
	get_likes,
	increment_likes,
}

export { like_store }
