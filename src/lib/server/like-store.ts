/* eslint-disable @typescript-eslint/triple-slash-reference -- tsgo needs explicit reference for Cloudflare types */
/// <reference path="../../../worker-configuration.d.ts" />
import { logger } from '$lib/logger'
import { eq, sql } from 'drizzle-orm'
import { database } from './db'
import { schema } from './db/schema'
import { kv_cache } from './kv-cache'

const INITIAL_COUNT = 0
const INCREMENT_VALUE = 1
const CACHE_KEY_PREFIX = 'like:'
const ERROR_DB_NOT_AVAILABLE = 'D1 database not available'

function get_cache_key(slug: string): string {
	return `${CACHE_KEY_PREFIX}${slug}`
}

function get_d1_binding(platform: App.Platform | undefined): D1Database {
	// Cloudflare D1 binding "DB" from wrangler.jsonc
	// eslint-disable-next-line @typescript-eslint/naming-convention -- Cloudflare D1 binding
	const platform_environment = platform?.env as { DB?: D1Database } | undefined
	const d1 = platform_environment?.DB

	if (d1 === undefined) {
		throw new Error(ERROR_DB_NOT_AVAILABLE)
	}

	return d1
}

function get_database(platform: App.Platform | undefined): ReturnType<typeof database.get> {
	return database.get(get_d1_binding(platform))
}

async function get_likes_from_database(
	slug: string,
	platform: App.Platform | undefined,
): Promise<number> {
	const database_instance = get_database(platform)
	const result = await database_instance
		.select()
		.from(schema.likes)
		.where(eq(schema.likes.slug, slug))
		.limit(1)

	return result[0]?.count ?? INITIAL_COUNT
}

async function update_likes_in_database(
	slug: string,
	platform: App.Platform | undefined,
): Promise<void> {
	const now = Date.now()
	const database_instance = get_database(platform)

	await database_instance
		.insert(schema.likes)
		.values({
			slug,
			count: INCREMENT_VALUE,
			updated_at: now,
		})
		.onConflictDoUpdate({
			target: schema.likes.slug,
			set: {
				count: sql`${schema.likes.count} + ${INCREMENT_VALUE}`,
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
				return await get_likes_from_database(slug, platform)
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
		await update_likes_in_database(slug, platform)
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
