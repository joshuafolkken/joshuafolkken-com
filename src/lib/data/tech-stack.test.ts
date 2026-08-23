import { describe, expect, it } from 'vitest'
import { ALL_ICONS } from './si-icons'
import { tech_colors } from './tech-colors'
import { CLOUDFLARE_D1 } from './tech-names'
import { tech_official_urls } from './tech-official-urls'
import { TECH_STACK } from './tech-stack'

const MISSING_COLOR = 'missing'

const ALL_BADGES = TECH_STACK.flatMap((category) => category.badges)
const ALL_NAMES = ALL_BADGES.map((badge) => badge.name)

function expect_unique(values: ReadonlyArray<string>): void {
	expect(new Set(values).size).toBe(values.length)
}

describe('TECH_STACK - badge presentation data', () => {
	it.each(ALL_BADGES)('renders $name with a logo, an official URL and a brand color', (badge) => {
		expect(ALL_ICONS.has(badge.logo)).toBe(true)
		expect(tech_official_urls.get_official_url(badge.name)).toBeDefined()
		expect(tech_colors.get(badge.name, MISSING_COLOR)).not.toBe(MISSING_COLOR)
	})
})

describe('TECH_STACK - category invariants', () => {
	it('lists every technology in exactly one category', () => {
		expect_unique(ALL_NAMES)
	})

	it('gives every category a distinct title', () => {
		expect_unique(TECH_STACK.map((category) => category.title))
	})
})

describe('TECH_STACK - Cloudflare D1 migration', () => {
	it('lists the database the like button runs on', () => {
		expect(ALL_NAMES).toContain(CLOUDFLARE_D1)
	})

	it.each(['TURSO', 'LibSQL'])(
		'keeps the retired %s entry as part of the career inventory',
		(name) => {
			expect(ALL_NAMES).toContain(name)
		},
	)
})
