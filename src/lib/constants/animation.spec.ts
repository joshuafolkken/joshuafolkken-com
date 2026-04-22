import { expect, test } from 'vitest'
import {
	ANIMATION_DELAY_MS,
	ANIMATION_DURATION_MS,
	FLY_OFFSET_Y_PX,
	SKILL_BAR_GLOW_BLUR_PX,
	SKILL_BAR_GLOW_SPREAD_PX,
	SKILL_BAR_HIDDEN_TRANSFORM,
	SKILL_BAR_REVEALED_TRANSFORM,
} from './animation'

test('ANIMATION_DURATION_MS is 500', () => {
	expect(ANIMATION_DURATION_MS).toBe(500)
})

test('ANIMATION_DELAY_MS is 100', () => {
	expect(ANIMATION_DELAY_MS).toBe(100)
})

test('FLY_OFFSET_Y_PX is 20', () => {
	expect(FLY_OFFSET_Y_PX).toBe(20)
})

test('SKILL_BAR_GLOW_BLUR_PX is 8', () => {
	expect(SKILL_BAR_GLOW_BLUR_PX).toBe(8)
})

test('SKILL_BAR_GLOW_SPREAD_PX is 2', () => {
	expect(SKILL_BAR_GLOW_SPREAD_PX).toBe(2)
})

test('SKILL_BAR_REVEALED_TRANSFORM is scaleX(1)', () => {
	expect(SKILL_BAR_REVEALED_TRANSFORM).toBe('scaleX(1)')
})

test('SKILL_BAR_HIDDEN_TRANSFORM is scaleX(0)', () => {
	expect(SKILL_BAR_HIDDEN_TRANSFORM).toBe('scaleX(0)')
})
