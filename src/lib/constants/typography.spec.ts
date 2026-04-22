import { expect, test } from 'vitest'
import { ICON_SIZE_MD } from './layout'
import { SECTION_ICON_SIZE } from './typography'

test('SECTION_ICON_SIZE matches ICON_SIZE_MD value', () => {
	expect(SECTION_ICON_SIZE).toBe(ICON_SIZE_MD)
})
