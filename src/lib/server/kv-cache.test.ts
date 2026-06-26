import { expect, test, vi } from 'vitest'
import { kv_cache } from './kv-cache'
import { platform_binding } from './platform-binding'

vi.mock('$lib/logger', () => ({
	logger: { debug: vi.fn(), error: vi.fn(), warn: vi.fn() },
}))
vi.mock('./cache-log-utilities', () => ({
	cache_log_utilities: {
		format_elapsed_ms: vi.fn().mockReturnValue('(0ms)'),
		format_value_for_log: vi.fn().mockReturnValue('[val]'),
	},
}))
vi.mock('./platform-binding', () => ({
	platform_binding: { get_kv: vi.fn() },
}))

const key_counter = { value: 0 }

function unique_key(): string {
	key_counter.value += 1

	return `kv-spec-${String(key_counter.value)}`
}

function make_mock_kv(delete_mock = vi.fn()): KVNamespace {
	return {
		get: vi.fn(),
		put: vi.fn(),
		delete: delete_mock,
	} as unknown as KVNamespace
}

test('get calls fetcher on cache miss and returns the fetched value', async () => {
	vi.mocked(platform_binding.get_kv).mockReturnValue(make_mock_kv())

	const key = unique_key()
	const fetched = { count: 7 }
	const fetcher = vi.fn().mockResolvedValue(fetched)

	const result = await kv_cache.get(key, fetcher)

	expect(fetcher).toHaveBeenCalledOnce()
	expect(result).toStrictEqual(fetched)
})

test('get returns cached memory value without calling fetcher on second call', async () => {
	vi.mocked(platform_binding.get_kv).mockReturnValue(make_mock_kv())

	const key = unique_key()
	const fetched = 'cached-string'
	const fetcher = vi.fn().mockResolvedValue(fetched)

	await kv_cache.get(key, fetcher)
	const result = await kv_cache.get(key, fetcher)

	expect(fetcher).toHaveBeenCalledOnce()
	expect(result).toBe(fetched)
})

test('delete calls kv.delete with the given key', async () => {
	const delete_mock = vi.fn()

	vi.mocked(platform_binding.get_kv).mockReturnValue(make_mock_kv(delete_mock))

	const key = unique_key()

	await kv_cache.delete(key)

	expect(delete_mock).toHaveBeenCalledWith(key)
})
