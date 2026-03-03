/* eslint-disable @typescript-eslint/triple-slash-reference -- tsgo needs explicit reference for Cloudflare types */
/// <reference path="../../../worker-configuration.d.ts" />
import { logger } from '$lib/logger'
import { time_conversion } from '$lib/time-conversion'
import { cache_log_utilities } from './cache-log-utilities'
import { platform_binding } from './platform-binding'

interface CacheEntry<T> {
	value: T
	expires: number
}

const CACHE_CONFIG = {
	memory: { minutes: 1 },
	kv: { minutes: 30 },
} as const

const LOG_PREFIX = '[kv-cache]'

type CacheSource = 'memory' | 'kv' | 'remote'
type CacheEvent = 'HIT' | 'MISS' | 'FETCH' | 'SAVE' | 'DELETE'

const SOURCE_LABEL: Record<CacheSource, string> = {
	memory: 'Memory',
	kv: 'KV',
	remote: 'Remote',
}

const MEMORY_TTL_MS = time_conversion.minutes_to_ms(CACHE_CONFIG.memory.minutes)
const KV_TTL_MS = time_conversion.minutes_to_ms(CACHE_CONFIG.kv.minutes)
const KV_TTL_SECONDS = time_conversion.minutes_to_sec(CACHE_CONFIG.kv.minutes)

const memory_cache = new Map<string, CacheEntry<unknown>>()

interface LogParts {
	source: string
	duration: string
	value: string
}

function get_log_parts(options: {
	source?: CacheSource
	value?: unknown
	started_at?: number
}): LogParts {
	const { source, value, started_at } = options

	return {
		source: source ? ` [${SOURCE_LABEL[source]}]` : '',
		duration: started_at ? ` ${cache_log_utilities.format_elapsed_ms(started_at)}` : '',
		value: value === undefined ? '' : ` ${cache_log_utilities.format_value_for_log(value)}`,
	}
}

function log_cache_event(
	event: CacheEvent,
	key: string,
	options: {
		source?: CacheSource
		value?: unknown
		started_at?: number
	} = {},
): void {
	const parts = get_log_parts(options)

	logger.debug(`${LOG_PREFIX} ${event}${parts.source}${parts.duration} ${key}${parts.value}`)
}

function set_to_memory(key: string, value: unknown, now: number): void {
	memory_cache.set(key, { value, expires: now + MEMORY_TTL_MS })
}

function get_from_memory(key: string, now: number): unknown {
	const memory_entry = memory_cache.get(key)

	if (memory_entry && memory_entry.expires > now) {
		log_cache_event('HIT', key, { source: 'memory', value: memory_entry.value, started_at: now })
		return memory_entry.value
	}

	return undefined
}

function is_kv_entry_expired(expires: unknown, now: number): boolean {
	return typeof expires !== 'number' || Number.isNaN(expires) || expires <= now
}

function parse_and_validate_kv_entry(
	kv_entry_string: string,
	now: number,
): CacheEntry<unknown> | undefined {
	try {
		const kv_entry = JSON.parse(kv_entry_string) as CacheEntry<unknown>
		if (is_kv_entry_expired(kv_entry.expires, now)) return undefined
		return kv_entry
	} catch {
		return undefined
	}
}

async function get_from_kv(key: string, kv: KVNamespace, now: number): Promise<unknown> {
	const kv_entry_string = await kv.get(key)
	if (!kv_entry_string) return undefined

	const kv_entry = parse_and_validate_kv_entry(kv_entry_string, now)
	if (!kv_entry) return undefined

	set_to_memory(key, kv_entry.value, now)
	log_cache_event('HIT', key, { source: 'kv', value: kv_entry.value, started_at: now })
	return kv_entry.value
}

async function save_to_cache(
	key: string,
	value: unknown,
	now: number,
	kv: KVNamespace,
): Promise<void> {
	set_to_memory(key, value, now)
	const cache_entry = { value, expires: now + KV_TTL_MS }

	try {
		await kv.put(key, JSON.stringify(cache_entry), {
			/* eslint-disable-next-line @typescript-eslint/naming-convention -- Cloudflare KV API contract */
			expirationTtl: KV_TTL_SECONDS,
		})
		log_cache_event('SAVE', key, { source: 'kv' })
	} catch (error) {
		const duration = cache_log_utilities.format_elapsed_ms(now)
		logger.error(`${LOG_PREFIX} Failed to save to KV ${duration} ${key}:`, error)
		throw error
	}
}

async function fetch_and_save<T>(
	key: string,
	fetcher: () => Promise<T>,
	now: number,
	kv: KVNamespace,
): Promise<T> {
	log_cache_event('MISS', key)
	const fresh = await fetcher()
	log_cache_event('FETCH', key, { source: 'remote', value: fresh, started_at: now })
	await save_to_cache(key, fresh, now, kv)
	return fresh
}

async function get<T>(
	key: string,
	fetcher: () => Promise<T>,
	platform: App.Platform | undefined,
): Promise<T> {
	const kv = platform_binding.get_kv(platform)
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
	const kv = platform_binding.get_kv(platform)

	memory_cache.delete(key)

	try {
		await kv.delete(key)
		log_cache_event('DELETE', key, { source: 'kv' })
	} catch (error) {
		logger.error(`${LOG_PREFIX} Failed to delete ${key}:`, error)
		throw error
	}
}

export const kv_cache = { get, delete: delete_cache }
