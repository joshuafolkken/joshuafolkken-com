/* eslint-disable @typescript-eslint/triple-slash-reference -- tsgo needs explicit reference for Cloudflare types */
/// <reference path="../../../worker-configuration.d.ts" />
import { logger } from '$lib/logger'
import { eq, sql } from 'drizzle-orm'
import { cache_keys } from './cache-keys'
import { schema } from './db/schema'
import { kv_cache } from './kv-cache'
import { platform_binding } from './platform-binding'

const INITIAL_COUNT = 0
const INCREMENT_VALUE = 1

function get_cache_key(slug: string): string {
	return `${cache_keys.LIKE}${slug}`
}

function get_count_from_result(result: Array<{ count: number }>): number {
	return result[0]?.count ?? INITIAL_COUNT
}

async function get_likes_from_database(
	slug: string,
	platform: App.Platform | undefined,
): Promise<number> {
	const database_instance = platform_binding.get_database(platform)
	const result = await database_instance
		.select()
		.from(schema.likes)
		.where(eq(schema.likes.slug, slug))
		.limit(1)

	return get_count_from_result(result)
}

async function update_likes_in_database(
	slug: string,
	platform: App.Platform | undefined,
): Promise<number> {
	const now = Date.now()
	const database_instance = platform_binding.get_database(platform)

	const result = await database_instance
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
		.returning({ count: schema.likes.count })

	return get_count_from_result(result)
}

async function get(slug: string, platform: App.Platform | undefined): Promise<number> {
	const cache_key = get_cache_key(slug)

	try {
		return await kv_cache.get(
			cache_key,
			async () => await get_likes_from_database(slug, platform),
			platform,
		)
	} catch (error) {
		logger.error('Failed to fetch likes from DB:', error)

		return INITIAL_COUNT
	}
}

async function increment(slug: string, platform: App.Platform | undefined): Promise<number> {
	logger.debug(`[like-store] Incrementing likes for slug: "${slug}"`)

	try {
		const count = await update_likes_in_database(slug, platform)
		const cache_key = get_cache_key(slug)

		await kv_cache.delete(cache_key, platform)

		logger.debug(`[like-store] New count after increment: ${String(count)}`)

		return count
	} catch (error) {
		logger.error('Failed to increment likes:', error)
		throw error
	}
}

const like_store = {
	get,
	increment,
}

export { like_store }
