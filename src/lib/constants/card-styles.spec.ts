import { describe, expect, it } from 'vitest'
import { PROJECT_CARD_TAGS_ROW_CLASS } from './card-styles'

const TECH_PILL_GAP_CLASS = 'gap-2.5'

describe('PROJECT_CARD_TAGS_ROW_CLASS', () => {
	it(`uses ${TECH_PILL_GAP_CLASS} to match TechStack badge spacing`, () => {
		expect(PROJECT_CARD_TAGS_ROW_CLASS).toContain(TECH_PILL_GAP_CLASS)
	})

	it('does not use the legacy tighter gap-x-1.5 / gap-y-2 pairing', () => {
		expect(PROJECT_CARD_TAGS_ROW_CLASS).not.toContain('gap-x-1.5')
		expect(PROJECT_CARD_TAGS_ROW_CLASS).not.toContain('gap-y-2')
	})
})
