import { describe, expect, it } from 'vitest'
import { keyboard_utilities } from './keyboard-utilities'

describe('keyboard_utilities.is_escape', () => {
	it('returns true for the Escape key', () => {
		expect(keyboard_utilities.is_escape({ key: 'Escape' })).toBe(true)
	})

	it('returns false for other keys', () => {
		expect(keyboard_utilities.is_escape({ key: 'Enter' })).toBe(false)
		expect(keyboard_utilities.is_escape({ key: 'Tab' })).toBe(false)
		expect(keyboard_utilities.is_escape({ key: ' ' })).toBe(false)
	})
})
