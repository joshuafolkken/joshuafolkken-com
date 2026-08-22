import { afterEach, describe, expect, it, vi } from 'vitest'
import { environment } from './environment'

const NAME = 'AUDIO_TEST_ENV'
const FALLBACK = 'fallback-value'
const SET_VALUE = 'set-value'

afterEach(() => {
	vi.unstubAllEnvs()
})

describe('environment.require_environment', () => {
	it('returns the value when the required variable is set', () => {
		vi.stubEnv(NAME, SET_VALUE)

		expect(environment.require_environment(NAME)).toBe(SET_VALUE)
	})

	it('throws when the variable is empty', () => {
		vi.stubEnv(NAME, '')

		expect(() => environment.require_environment(NAME)).toThrow('Missing required env')
	})
})

describe('environment.optional_environment', () => {
	it('returns the value when the optional variable is set', () => {
		vi.stubEnv(NAME, SET_VALUE)

		expect(environment.optional_environment(NAME, FALLBACK)).toBe(SET_VALUE)
	})

	it('falls back to the default when the variable is empty', () => {
		vi.stubEnv(NAME, '')

		expect(environment.optional_environment(NAME, FALLBACK)).toBe(FALLBACK)
	})

	it('calls a thunk fallback only when the variable is absent', () => {
		vi.stubEnv(NAME, '')
		const fallback = vi.fn(() => FALLBACK)

		expect(environment.optional_environment(NAME, fallback)).toBe(FALLBACK)
		expect(fallback).toHaveBeenCalledTimes(1)
	})

	it('never calls a thunk fallback when the variable is set', () => {
		vi.stubEnv(NAME, SET_VALUE)
		const fallback = vi.fn(() => {
			throw new Error('fallback must stay lazy')
		})

		expect(environment.optional_environment(NAME, fallback)).toBe(SET_VALUE)
		expect(fallback).not.toHaveBeenCalled()
	})
})

describe('environment.read_environment', () => {
	it('returns the raw value when set and undefined when unset', () => {
		vi.stubEnv(NAME, 'raw-value')

		expect(environment.read_environment(NAME)).toBe('raw-value')
	})
})
