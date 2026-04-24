import { expect, test } from 'vitest'
import { LOCALHOST_HOSTNAMES } from './security'

test('LOCALHOST_HOSTNAMES includes localhost and 127.0.0.1', () => {
	expect(LOCALHOST_HOSTNAMES.has('localhost')).toBe(true)
	expect(LOCALHOST_HOSTNAMES.has('127.0.0.1')).toBe(true)
})
