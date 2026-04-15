import { expect, test } from 'vitest'
import { kv_cache_entry } from './kv-cache-entry'

const NOW = 1_000_000
const FUTURE_EXPIRES = NOW + 1000
const PAST_EXPIRES = NOW - 1

test('parses a valid non-expired entry', () => {
	const raw = JSON.stringify({ value: { count: 5 }, expires: FUTURE_EXPIRES })

	expect(kv_cache_entry.parse_and_validate(raw, NOW)).toStrictEqual({
		value: { count: 5 },
		expires: FUTURE_EXPIRES,
	})
})

test('returns undefined when the entry is already expired', () => {
	const raw = JSON.stringify({ value: 'data', expires: PAST_EXPIRES })

	expect(kv_cache_entry.parse_and_validate(raw, NOW)).toBeUndefined()
})

test('returns undefined when expires is not a number', () => {
	const raw = JSON.stringify({ value: 'data', expires: 'not-a-number' })

	expect(kv_cache_entry.parse_and_validate(raw, NOW)).toBeUndefined()
})

test('returns undefined when the value key is missing', () => {
	const raw = JSON.stringify({ expires: FUTURE_EXPIRES })

	expect(kv_cache_entry.parse_and_validate(raw, NOW)).toBeUndefined()
})

test('returns undefined when the JSON payload is malformed', () => {
	expect(kv_cache_entry.parse_and_validate('not json', NOW)).toBeUndefined()
})

test('returns undefined when the JSON root is not a shaped object', () => {
	expect(kv_cache_entry.parse_and_validate('42', NOW)).toBeUndefined()
	expect(kv_cache_entry.parse_and_validate('null', NOW)).toBeUndefined()
	expect(kv_cache_entry.parse_and_validate('["a"]', NOW)).toBeUndefined()
})

test('is_cache_entry_shape narrows well-formed and rejects malformed inputs', () => {
	expect(kv_cache_entry.is_cache_entry_shape({ value: 1, expires: 1 })).toBe(true)
	expect(kv_cache_entry.is_cache_entry_shape({ expires: 1 })).toBe(false)
	expect(kv_cache_entry.is_cache_entry_shape('string')).toBe(false)
	expect(kv_cache_entry.is_cache_entry_shape(42)).toBe(false)
})

test('is_cache_entry_shape rejects non-finite expires values so entries cannot live forever', () => {
	expect(kv_cache_entry.is_cache_entry_shape({ value: 1, expires: Infinity })).toBe(false)
	expect(kv_cache_entry.is_cache_entry_shape({ value: 1, expires: -Infinity })).toBe(false)
})
