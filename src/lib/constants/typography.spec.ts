import { expect, test } from 'vitest'
import { SECTION_ICON_SIZE } from './typography'

test('SECTION_ICON_SIZE matches ICON_SIZE_MD value', () => {
	expect(SECTION_ICON_SIZE).toBe('1.25rem')
})
