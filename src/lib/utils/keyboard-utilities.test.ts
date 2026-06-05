import { describe, expect, it } from 'vitest'
import { keyboard_utilities } from './keyboard-utilities'

const ENTER = 'Enter'
const ESCAPE = 'Escape'

describe('keyboard_utilities.is_escape', () => {
	it('returns true for the Escape key', () => {
		expect(keyboard_utilities.is_escape({ key: ESCAPE })).toBe(true)
	})

	it('returns false for non-Escape keys', () => {
		expect(keyboard_utilities.is_escape({ key: ENTER })).toBe(false)
		expect(keyboard_utilities.is_escape({ key: 'Tab' })).toBe(false)
		expect(keyboard_utilities.is_escape({ key: ' ' })).toBe(false)
	})
})

describe('keyboard_utilities.is_enter', () => {
	it('returns true for a plain Enter press', () => {
		expect(keyboard_utilities.is_enter({ key: ENTER })).toBe(true)
	})

	it('returns false for the Enter that confirms an IME composition', () => {
		expect(keyboard_utilities.is_enter({ key: ENTER, isComposing: true })).toBe(false)
	})

	it('returns false for non-Enter keys', () => {
		expect(keyboard_utilities.is_enter({ key: ESCAPE })).toBe(false)
	})
})
