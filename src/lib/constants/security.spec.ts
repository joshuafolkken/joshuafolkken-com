import { expect, test } from 'vitest'
import { LOCALHOST_HOSTNAMES, RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW_MS } from './security'

test('RATE_LIMIT_COUNT is 60', () => {
	expect(RATE_LIMIT_COUNT).toBe(60)
})

test('RATE_LIMIT_WINDOW_MS is one minute in milliseconds', () => {
	expect(RATE_LIMIT_WINDOW_MS).toBe(60_000)
})

test('LOCALHOST_HOSTNAMES includes localhost and 127.0.0.1', () => {
	expect(LOCALHOST_HOSTNAMES.has('localhost')).toBe(true)
	expect(LOCALHOST_HOSTNAMES.has('127.0.0.1')).toBe(true)
})
