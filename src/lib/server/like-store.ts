import { turso } from './turso'

// サーバーメモリ上のキャッシュ
// { 'slug': count }
const local_cache = new Map<string, number>()

const INITIAL_COUNT = 0
const SELECT_LIKES_QUERY = 'SELECT count FROM post_likes WHERE slug = ?'
const INSERT_LIKE_QUERY = `
    INSERT INTO post_likes (slug, count, updated_at)
    VALUES (?, 1, ?)
    ON CONFLICT(slug) DO UPDATE SET
        count = count + 1,
        updated_at = excluded.updated_at
`

function get_from_cache(slug: string): number | undefined {
	const cached = local_cache.get(slug)
	if (cached !== undefined) {
		console.info(`[like-store] Cache HIT for "${slug}": ${String(cached)}`)
		return cached
	}
	return undefined
}

async function get_likes_from_database(slug: string): Promise<number> {
	const result = await turso.client.execute({
		sql: SELECT_LIKES_QUERY,
		args: [slug],
	})
	// eslint-disable-next-line dot-notation
	return (result.rows[0]?.['count'] as number | undefined) ?? INITIAL_COUNT
}

async function update_likes_in_database(slug: string): Promise<void> {
	await turso.client.execute({
		sql: INSERT_LIKE_QUERY,
		args: [slug, Date.now()],
	})
}

async function get_likes(slug: string): Promise<number> {
	const cached = get_from_cache(slug)
	if (cached !== undefined) return cached

	console.info(`[like-store] Cache MISS for "${slug}". Fetching...`)

	try {
		const count = await get_likes_from_database(slug)
		console.info(`[like-store] Resolved count: ${String(count)}`)

		local_cache.set(slug, count)
		return count
	} catch (error) {
		console.error('Failed to fetch likes from DB:', error)
		return INITIAL_COUNT
	}
}

async function increment_likes(slug: string): Promise<number> {
	console.info(`[like-store] Incrementing likes for slug: "${slug}"`)
	try {
		await update_likes_in_database(slug)
		const new_count = await get_likes_from_database(slug)

		console.info(`[like-store] New count after increment: ${String(new_count)}`)

		local_cache.set(slug, new_count)
		return new_count
	} catch (error) {
		console.error('Failed to increment likes:', error)
		throw error
	}
}

const like_store = {
	get_likes,
	increment_likes,
}

export { like_store }
