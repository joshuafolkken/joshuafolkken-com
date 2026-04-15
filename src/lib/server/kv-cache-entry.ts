interface CacheEntry<T> {
	value: T
	expires: number
}

function is_object(value: unknown): value is object {
	return typeof value === 'object' && value !== null
}

function is_cache_entry_shape(candidate: unknown): candidate is CacheEntry<unknown> {
	if (!is_object(candidate)) return false
	if (!('value' in candidate) || !('expires' in candidate)) return false

	return Number.isFinite(candidate.expires)
}

function parse_and_validate(raw: string, now: number): CacheEntry<unknown> | undefined {
	try {
		const parsed: unknown = JSON.parse(raw)
		if (!is_cache_entry_shape(parsed)) return undefined
		if (parsed.expires <= now) return undefined

		return parsed
	} catch {
		return undefined
	}
}

const kv_cache_entry = { is_cache_entry_shape, parse_and_validate }

export { kv_cache_entry }
export type { CacheEntry }
