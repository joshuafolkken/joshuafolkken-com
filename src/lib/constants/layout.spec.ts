import { expect, test } from 'vitest'
import {
	LAST_UPDATED_CLASS,
	LIST_DECIMAL_CLASS,
	LIST_DISC_CLASS,
	LIST_DISC_LINK_CLASS,
	SECTION_HEADING_3_CLASS,
} from './layout'

const EXPECTED: ReadonlyArray<readonly [string, string]> = [
	['LIST_DISC_CLASS', LIST_DISC_CLASS],
	['LIST_DISC_LINK_CLASS', LIST_DISC_LINK_CLASS],
	['LIST_DECIMAL_CLASS', LIST_DECIMAL_CLASS],
	['SECTION_HEADING_3_CLASS', SECTION_HEADING_3_CLASS],
	['LAST_UPDATED_CLASS', LAST_UPDATED_CLASS],
]

test.each(EXPECTED)('%s is a non-empty string', (_name, value) => {
	expect(typeof value).toBe('string')
	expect(value.length).toBeGreaterThan(0)
})
