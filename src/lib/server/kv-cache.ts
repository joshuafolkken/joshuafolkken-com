interface CacheEntry<T> {
	value: T
	expires: number
}

interface KVNamespace {
	get: (key: string) => Promise<string | null>
	put: (key: string, value: string) => Promise<void>
}

const MS_PER_SEC = 1000
const SEC_PER_MIN = 60

const MEMORY_TTL_MINUTES = 1
const KV_TTL_MINUTES = 10

const memory_cache = new Map<string, CacheEntry<unknown>>()

const MEMORY_TTL_MS = MS_PER_SEC * SEC_PER_MIN * MEMORY_TTL_MINUTES
const KV_TTL_MS = MS_PER_SEC * SEC_PER_MIN * KV_TTL_MINUTES

function log_cache_hit(source: 'memory' | 'kv', key: string, value: unknown): void {
	console.info(`[kv-cache] ${source === 'memory' ? 'Memory' : 'KV'} cache hit for ${key}:`, value)
}

function get_from_memory(key: string, now: number): unknown {
	const memory_entry = memory_cache.get(key)

	if (memory_entry !== undefined && memory_entry.expires > now) {
		log_cache_hit('memory', key, memory_entry.value)
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
		log_cache_hit('kv', key, kv_entry.value)
		return kv_entry.value
	} catch {
		// Invalid JSON, ignore
		return undefined
	}
}

interface SaveCacheParameters {
	key: string
	value: unknown
	now: number
	kv: KVNamespace
}

async function save_to_cache(parameters: SaveCacheParameters): Promise<void> {
	const { key, value, now, kv } = parameters
	memory_cache.set(key, { value, expires: now + MEMORY_TTL_MS })
	const cache_entry = { value, expires: now + KV_TTL_MS }
	await kv.put(key, JSON.stringify(cache_entry))
}

// eslint-disable-next-line max-statements
async function get<T>(key: string, fetcher: () => Promise<T>, kv: KVNamespace): Promise<T> {
	const now = Date.now()
	const memory_value = get_from_memory(key, now)

	if (memory_value !== undefined) {
		return memory_value as T
	}

	const kv_value = await get_from_kv(key, kv, now)

	if (kv_value !== undefined) {
		return kv_value as T
	}

	console.info(`[kv-cache] Cache miss for ${key}, fetching fresh value`)
	const fresh = await fetcher()
	console.info(`[kv-cache] Fetched fresh value for ${key}:`, fresh)
	await save_to_cache({ key, value: fresh, now, kv })

	return fresh
}

export const kv_cache = { get }
