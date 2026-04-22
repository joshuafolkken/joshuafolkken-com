import { expect, test } from 'vitest'
import { INTERACTIVE_SCALE_HOVER } from './interactive-effects'
import { ICON_SIZE_MD } from './layout'
import {
	MENU_TOGGLE_BUTTON_CLASSES,
	NAV_ICON_SIZE,
	SOCIAL_LINK_DESKTOP_CLASSES,
	SOCIAL_LINK_MOBILE_CLASSES,
} from './sticky-header-constants'

const CONSUMER_CASES: ReadonlyArray<readonly [string, string]> = [
	['SOCIAL_LINK_DESKTOP_CLASSES', SOCIAL_LINK_DESKTOP_CLASSES],
	['MENU_TOGGLE_BUTTON_CLASSES', MENU_TOGGLE_BUTTON_CLASSES],
	['SOCIAL_LINK_MOBILE_CLASSES', SOCIAL_LINK_MOBILE_CLASSES],
]

test('INTERACTIVE_SCALE_HOVER resolves to the shared Tailwind tokens', () => {
	expect(INTERACTIVE_SCALE_HOVER).toBe('hover:scale-110 active:scale-95')
})

test('NAV_ICON_SIZE matches ICON_SIZE_MD value', () => {
	expect(NAV_ICON_SIZE).toBe(ICON_SIZE_MD)
})

test.each(CONSUMER_CASES)('%s includes INTERACTIVE_SCALE_HOVER exactly once', (_name, value) => {
	const occurrences = value.split(INTERACTIVE_SCALE_HOVER).length - 1

	expect(occurrences).toBe(1)
})
