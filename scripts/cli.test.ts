import { describe, expect, it } from 'vitest'
import { cli } from './cli'

const USAGE = 'Usage: pnpm example <arg>'
const FIRST_ARGUMENT = 'first'
const MAX_REST = 2

describe('cli.read_required_argument', () => {
	it('returns the first positional argument', () => {
		expect(cli.read_required_argument([FIRST_ARGUMENT, 'second'], USAGE)).toBe(FIRST_ARGUMENT)
	})

	it('throws the usage string when no argument is given', () => {
		expect(() => cli.read_required_argument([], USAGE)).toThrow(USAGE)
	})
})

describe('cli.read_argument_with_rest', () => {
	it('splits the required argument from the optional trailing ones', () => {
		expect(
			cli.read_argument_with_rest([FIRST_ARGUMENT, 'second', 'third'], USAGE, MAX_REST),
		).toEqual({
			value: FIRST_ARGUMENT,
			rest: ['second', 'third'],
		})
	})

	it('returns an empty rest when only the required argument is given', () => {
		expect(cli.read_argument_with_rest([FIRST_ARGUMENT], USAGE, MAX_REST)).toEqual({
			value: FIRST_ARGUMENT,
			rest: [],
		})
	})

	it('throws the usage string when more trailing arguments than max_rest are given', () => {
		expect(() =>
			cli.read_argument_with_rest([FIRST_ARGUMENT, 'a', 'b', 'c'], USAGE, MAX_REST),
		).toThrow(USAGE)
	})

	it('throws the usage string when the required argument is missing', () => {
		expect(() => cli.read_argument_with_rest([], USAGE, MAX_REST)).toThrow(USAGE)
	})
})
