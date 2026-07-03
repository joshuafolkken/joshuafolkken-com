import { logger } from '$lib/logger'
import { expect, test, vi } from 'vitest'
import { parse_json_array } from './parse-json-array'

function is_number(value: unknown): value is number {
	return typeof value === 'number'
}

test('keeps only the items that pass the guard', () => {
	expect(parse_json_array('[1,"a",2,null]', is_number, 'label')).toStrictEqual([1, 2])
})

test('returns an empty array when the JSON root is not an array', () => {
	expect(parse_json_array('{"a":1}', is_number, 'label')).toStrictEqual([])
})

test('returns an empty array and logs the label on malformed json', () => {
	expect.assertions(2)
	const error_spy = vi.spyOn(logger, 'error')

	try {
		expect(parse_json_array('not json', is_number, 'bad label')).toStrictEqual([])
		expect(error_spy).toHaveBeenCalledWith('bad label', expect.any(SyntaxError))
	} finally {
		error_spy.mockRestore()
	}
})
