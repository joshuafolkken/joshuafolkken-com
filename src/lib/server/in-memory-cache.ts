import { logger } from '$lib/logger'

const SECONDS_PER_MINUTE = 60
const MILLISECONDS_PER_SECOND = 1000

const DEFAULT_TTL_MINUTES = 10
const LIKE_TTL_MINUTES = 10
const SUPPORTERS_TTL_MINUTES = 60

const DEFAULT_TTL_MS = DEFAULT_TTL_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
const LIKE_TTL_MS = LIKE_TTL_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
const SUPPORTERS_TTL_MS = SUPPORTERS_TTL_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND

const DEFAULT_MAX_SIZE = 100

interface TtlConfig {
	prefix?: string
	exact?: string
	ttl_ms: number
}

const TTL_CONFIGS: Array<TtlConfig> = [
	{ prefix: 'like:', ttl_ms: LIKE_TTL_MS },
	{ exact: 'supporters', ttl_ms: SUPPORTERS_TTL_MS },
]

interface CacheEntry<T> {
	value: T
	timestamp: number
	ttl_ms: number
}

class InMemoryCache {
	private readonly cache = new Map<string, CacheEntry<unknown>>()
	private readonly max_size: number

	constructor(max_size: number = DEFAULT_MAX_SIZE) {
		this.max_size = max_size
	}

	private matches_config(key: string, config: TtlConfig): boolean {
		if (config.exact !== undefined && key === config.exact) {
			return true
		}

		if (config.prefix !== undefined && key.startsWith(config.prefix)) {
			return true
		}

		return false
	}

	private get_ttl_for_key(key: string): number {
		const matched_config = TTL_CONFIGS.find((config) => this.matches_config(key, config))
		return matched_config?.ttl_ms ?? DEFAULT_TTL_MS
	}

	async with_cache<T>(key: string, executor: () => Promise<T>): Promise<T> {
		const now = Date.now()
		const cached_value = this.get_cached_value(key, now)

		if (cached_value !== undefined) {
			return cached_value as T
		}

		return await this.fetch_and_cache(key, executor, now)
	}

	private async fetch_and_cache<T>(
		key: string,
		executor: () => Promise<T>,
		now: number,
	): Promise<T> {
		// logger.debug(`Cache miss ${key}`)
		const value = await executor()

		if (this.cache.size >= this.max_size) {
			this.prune_cache(now)
		}

		this.set_cached_value(key, value, now)

		return value
	}

	private set_cached_value(key: string, value: unknown, now: number): void {
		const ttl_ms = this.get_ttl_for_key(key)
		this.cache.set(key, { value, timestamp: now, ttl_ms })
	}

	delete(key: string): void {
		this.cache.delete(key)
	}

	private is_entry_valid(entry: CacheEntry<unknown>, now: number): boolean {
		return now - entry.timestamp < entry.ttl_ms
	}

	private get_cached_value(key: string, now: number): unknown {
		const entry = this.cache.get(key)
		if (entry === undefined) return undefined

		if (this.is_entry_valid(entry, now)) {
			logger.debug(`Cache hit for ${key}`)
			return entry.value
		}

		this.cache.delete(key)
		logger.debug(`Cache expired for ${key}`)
		return undefined
	}

	private prune_cache(now: number): void {
		this.remove_expired_entries(now)
		this.remove_overflow_entries()
	}

	private remove_expired_entries(now: number): void {
		for (const [key, entry] of this.cache.entries()) {
			if (!this.is_entry_valid(entry, now)) {
				this.cache.delete(key)
			}
		}
	}

	private remove_overflow_entries(): void {
		while (this.cache.size >= this.max_size) {
			const first_key = this.cache.keys().next().value
			if (first_key === undefined) break
			this.cache.delete(first_key)
		}
	}
}

const global_cache = new InMemoryCache()

export const in_memory_cache = {
	instance: global_cache,
	with_cache: global_cache.with_cache.bind(global_cache),
	delete: global_cache.delete.bind(global_cache),
}

export type { InMemoryCache }
