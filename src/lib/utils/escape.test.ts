import { expect, test } from 'vitest'
import { markup } from './escape'

const PLAIN = 'hello world'

test('escapes all five markup-significant characters', () => {
	expect(markup.escape('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#39;')
})

test('escapes ampersands first so entities are not double-escaped', () => {
	expect(markup.escape('a & <b>')).toBe('a &amp; &lt;b&gt;')
})

test('returns text without markup characters unchanged', () => {
	expect(markup.escape(PLAIN)).toBe(PLAIN)
})
