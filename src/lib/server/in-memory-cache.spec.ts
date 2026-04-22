import { describe, expect, test, vi } from 'vitest'
import { in_memory_cache } from './in-memory-cache'

vi.mock('$lib/logger', () => ({
	logger: { debug: vi.fn() },
}))

let key_counter = 0

function unique_key(): string {
	key_counter += 1

	return `im-spec-${String(key_counter)}`
}

describe('with_cache', () => {
	test('calls executor on cache miss and returns the value', async () => {
		const key = unique_key()
		const value = { score: 42 }
		const executor = vi.fn().mockResolvedValue(value)

		const result = await in_memory_cache.with_cache(key, executor)

		expect(executor).toHaveBeenCalledOnce()
		expect(result).toStrictEqual(value)
	})

	test('returns cached value without calling executor on second call', async () => {
		const key = unique_key()
		const value = 'cached'
		const executor = vi.fn().mockResolvedValue(value)

		await in_memory_cache.with_cache(key, executor)
		const result = await in_memory_cache.with_cache(key, executor)

		expect(executor).toHaveBeenCalledOnce()
		expect(result).toBe(value)
	})
})

describe('delete', () => {
	test('removes cached entry so executor is called again on next access', async () => {
		const key = unique_key()
		const executor = vi.fn().mockResolvedValue(1)

		await in_memory_cache.with_cache(key, executor)
		in_memory_cache.delete(key)
		await in_memory_cache.with_cache(key, executor)

		expect(executor).toHaveBeenCalledTimes(2)
	})
})
