interface CacheEntry<T> {
	value: T
	expires: number
}

function is_record(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

function is_finite_number(value: unknown): value is number {
	return typeof value === 'number' && !Number.isNaN(value)
}

function is_cache_entry_shape(candidate: unknown): candidate is CacheEntry<unknown> {
	if (!is_record(candidate)) return false
	if (!('value' in candidate)) return false

	return is_finite_number(candidate.expires)
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
