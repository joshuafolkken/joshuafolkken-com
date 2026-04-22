import { expect, test, vi } from 'vitest'
import { validator_chain, type ValidationResult, type ValidatorFunction } from './validator-chain'

const DUMMY_URL_STRING = 'http://localhost'
const DUMMY_REQUEST = new Request(DUMMY_URL_STRING)
const DUMMY_URL = new URL(DUMMY_URL_STRING)
const DUMMY_IP = '127.0.0.1'
const ERROR_RESPONSE = new Response(undefined, { status: 403 })

function make_passing_validator(): ValidatorFunction {
	return vi.fn()
}

function make_failing_validator(response: ValidationResult): ValidatorFunction {
	return vi.fn().mockReturnValue(response)
}

test('returns undefined when all validators pass', () => {
	const v1 = make_passing_validator()
	const v2 = make_passing_validator()

	const result = validator_chain.run_validators([v1, v2], DUMMY_REQUEST, DUMMY_URL, DUMMY_IP)

	expect(result).toBeUndefined()
	expect(v1).toHaveBeenCalledOnce()
	expect(v2).toHaveBeenCalledOnce()
})

test('returns error and stops chain when first validator fails', () => {
	const v1 = make_failing_validator(ERROR_RESPONSE)
	const v2 = make_passing_validator()

	const result = validator_chain.run_validators([v1, v2], DUMMY_REQUEST, DUMMY_URL, DUMMY_IP)

	expect(result).toBe(ERROR_RESPONSE)
	expect(v2).not.toHaveBeenCalled()
})

test('returns error and stops chain when middle validator fails', () => {
	const v1 = make_passing_validator()
	const v2 = make_failing_validator(ERROR_RESPONSE)
	const v3 = make_passing_validator()

	const result = validator_chain.run_validators([v1, v2, v3], DUMMY_REQUEST, DUMMY_URL, DUMMY_IP)

	expect(result).toBe(ERROR_RESPONSE)
	expect(v1).toHaveBeenCalledOnce()
	expect(v3).not.toHaveBeenCalled()
})

test('returns undefined for empty validator list', () => {
	const result = validator_chain.run_validators([], DUMMY_REQUEST, DUMMY_URL, DUMMY_IP)

	expect(result).toBeUndefined()
})
