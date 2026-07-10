import { describe, expect, it } from 'vitest'
import { cli } from './cli'

const USAGE = 'Usage: pnpm example <arg>'

describe('cli.read_required_argument', () => {
	it('returns the first positional argument', () => {
		expect(cli.read_required_argument(['first', 'second'], USAGE)).toBe('first')
	})

	it('throws the usage string when no argument is given', () => {
		expect(() => cli.read_required_argument([], USAGE)).toThrow(USAGE)
	})
})
