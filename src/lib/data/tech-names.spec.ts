import { expect, test } from 'vitest'
import {
	CLOUDFLARE_D1,
	CLOUDFLARE_KV,
	CLOUDFLARE_R2,
	CLOUDFLARE_WORKERS,
	GDSCRIPT,
	GODOT,
	WEB_EXPORT,
} from './tech-names'

const EXPECTED: ReadonlyArray<readonly [string, string]> = [
	['CLOUDFLARE_WORKERS', CLOUDFLARE_WORKERS],
	['CLOUDFLARE_KV', CLOUDFLARE_KV],
	['CLOUDFLARE_D1', CLOUDFLARE_D1],
	['CLOUDFLARE_R2', CLOUDFLARE_R2],
	['GODOT', GODOT],
	['GDSCRIPT', GDSCRIPT],
	['WEB_EXPORT', WEB_EXPORT],
]

test.each(EXPECTED)('%s is a non-empty string', (_name, value) => {
	expect(typeof value).toBe('string')
	expect(value.length).toBeGreaterThan(0)
})

test('tech name values are unique', () => {
	const values = EXPECTED.map(([, value]) => value)
	const unique = new Set(values)

	expect(unique.size).toBe(values.length)
})
