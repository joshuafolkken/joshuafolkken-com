import { logger } from '$lib/logger'

interface CacheEntry<T> {
	value: T
	expires: number
}

const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60

const MEMORY_TTL_MINUTES = 1
const KV_SUPPORTERS_TTL_MINUTES = 30
// const KV_LIKE_TTL_MINUTES = 5

const memory_cache = new Map<string, CacheEntry<unknown>>()

const MEMORY_TTL_MS = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MEMORY_TTL_MINUTES
const KV_SUPPORTERS_TTL_MS =
	MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * KV_SUPPORTERS_TTL_MINUTES
const MAX_LOG_VALUE_LENGTH = 80
const ERROR_KV_CACHE_NOT_AVAILABLE = 'KV cache not available'

function value_to_string(value: unknown): string {
	if (value === null || value === undefined) {
		return String(value)
	}

	if (typeof value === 'object') {
		return JSON.stringify(value)
	}

	// At this point, value is a primitive type (string, number, boolean, symbol, bigint)
	const primitive_value = value as string | number | boolean | symbol | bigint
	return String(primitive_value)
}

function format_value_for_log(value: unknown): string {
	try {
		const string_value = value_to_string(value)
		const without_newlines = string_value.replaceAll('\n', ' ')
		return without_newlines.length > MAX_LOG_VALUE_LENGTH
			? without_newlines.slice(0, MAX_LOG_VALUE_LENGTH)
			: without_newlines
	} catch {
		return String(value)
	}
}

function get_duration(start_time: number): string {
	const duration = Date.now() - start_time
	return `${String(duration)}ms`
}

function log_cache_hit(
	source: 'memory' | 'kv',
	key: string,
	value: unknown,
	start_time: number,
): void {
	const formatted_value = format_value_for_log(value)
	const duration = get_duration(start_time)

	logger.debug(
		`[kv-cache] ${source === 'memory' ? 'Memory' : 'KV'} ${duration} ${key} ${formatted_value}`,
	)
}

function get_from_memory(key: string, now: number): unknown {
	const memory_entry = memory_cache.get(key)

	if (memory_entry !== undefined && memory_entry.expires > now) {
		log_cache_hit('memory', key, memory_entry.value, now)
		return memory_entry.value
	}

	return undefined
}

// eslint-disable-next-line max-statements
async function get_from_kv(key: string, kv: KVNamespace, now: number): Promise<unknown> {
	const kv_entry_string = await kv.get(key)

	if (kv_entry_string === null) {
		return undefined
	}

	try {
		const kv_entry = JSON.parse(kv_entry_string) as CacheEntry<unknown>

		if (kv_entry.expires <= now) {
			return undefined
		}

		const entry = { value: kv_entry.value, expires: now + MEMORY_TTL_MS }
		memory_cache.set(key, entry)
		log_cache_hit('kv', key, kv_entry.value, now)
		return kv_entry.value
	} catch {
		// Invalid JSON, ignore
		return undefined
	}
}

async function save_to_cache(
	key: string,
	value: unknown,
	now: number,
	kv: KVNamespace,
): Promise<void> {
	memory_cache.set(key, { value, expires: now + MEMORY_TTL_MS })
	const cache_entry = { value, expires: now + KV_SUPPORTERS_TTL_MS }

	try {
		await kv.put(key, JSON.stringify(cache_entry))
		logger.debug(`[kv-cache] saved to KV: ${key}`)
	} catch (error) {
		const duration = get_duration(now)
		logger.error(`[kv-cache] Failed to save to KV ${duration} ${key}:`, error)
		throw error
	}
}

async function fetch_and_save<T>(
	key: string,
	fetcher: () => Promise<T>,
	now: number,
	kv: KVNamespace,
): Promise<T> {
	logger.debug(`[kv-cache] Cache miss ${key}`)
	const fresh = await fetcher()
	const formatted_fresh = format_value_for_log(fresh)
	const duration = get_duration(now)
	logger.debug(`[kv-cache] Fetched ${duration} ${key}: ${formatted_fresh}`)
	await save_to_cache(key, fresh, now, kv)
	return fresh
}

function get_kv_from_platform(platform: App.Platform | undefined): KVNamespace | undefined {
	if (platform?.env === undefined || platform.env === null) {
		return undefined
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const cache = (platform.env as { CACHE?: KVNamespace }).CACHE
	return cache ?? undefined
}

function ensure_kv(kv: KVNamespace | undefined): KVNamespace {
	if (kv === undefined) {
		throw new Error(ERROR_KV_CACHE_NOT_AVAILABLE)
	}

	return kv
}

async function get<T>(
	key: string,
	fetcher: () => Promise<T>,
	platform: App.Platform | undefined,
): Promise<T> {
	const kv = ensure_kv(get_kv_from_platform(platform))
	const now = Date.now()
	const memory_value = get_from_memory(key, now)

	if (memory_value !== undefined) {
		return memory_value as T
	}

	const kv_value = await get_from_kv(key, kv, now)

	if (kv_value !== undefined) {
		return kv_value as T
	}

	return await fetch_and_save(key, fetcher, now, kv)
}

async function delete_cache(key: string, platform: App.Platform | undefined): Promise<void> {
	const kv = ensure_kv(get_kv_from_platform(platform))

	memory_cache.delete(key)

	try {
		await kv.delete(key)
		logger.debug(`[kv-cache] Successfully deleted ${key}`)
	} catch (error) {
		logger.error(`[kv-cache] Failed to delete ${key}:`, error)
		throw error
	}
}

export const kv_cache = { get_kv_from_platform, get, delete: delete_cache }
