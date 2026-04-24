import { describe, expect, it } from 'vitest'
import { sticky_header_menu } from './sticky-header-menu'

const CYBER_GLOW_HOVER = 'cyber-glow-hover'

describe('sticky_header_menu.get_link_classes (mobile)', () => {
	it('applies the cyber-glow-hover utility to inactive mobile items', () => {
		const classes = sticky_header_menu.get_link_classes('mobile', false)

		expect(classes).toContain(CYBER_GLOW_HOVER)
	})

	it('applies the cyber-glow-hover utility to active mobile items', () => {
		const classes = sticky_header_menu.get_link_classes('mobile', true)

		expect(classes).toContain(CYBER_GLOW_HOVER)
	})

	it('preserves the active-state indicator classes on mobile', () => {
		const classes = sticky_header_menu.get_link_classes('mobile', true)

		expect(classes).toContain('border-sky-400')
		expect(classes).toContain('text-sky-400')
	})
})

describe('sticky_header_menu.get_link_classes (desktop)', () => {
	it('keeps the cyber-glow-hover utility on desktop items (regression)', () => {
		const classes = sticky_header_menu.get_link_classes('desktop', false)

		expect(classes).toContain(CYBER_GLOW_HOVER)
	})
})
