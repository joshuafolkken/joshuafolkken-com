import { logger } from '$lib/logger'
import { expect, test, vi } from 'vitest'
import { chat_log_payload } from './chat-log-payload'

test('returns an empty array when the JSON root is not an array', () => {
	expect(chat_log_payload.parse('{"notAnArray": true}')).toStrictEqual([])
})

test('returns an empty array when the JSON payload is malformed', () => {
	expect(chat_log_payload.parse('not json')).toStrictEqual([])
})

test('returns valid chat messages unchanged', () => {
	const raw = '[{"role":"user","text":"hi"},{"role":"assistant","text":"hello"}]'

	expect(chat_log_payload.parse(raw)).toStrictEqual([
		{ role: 'user', text: 'hi' },
		{ role: 'assistant', text: 'hello' },
	])
})

test('keeps a valid ISO timestamp on an assistant message', () => {
	const raw = '[{"role":"assistant","text":"hi","timestamp":"2026-07-08T13:45:00.000Z"}]'

	expect(chat_log_payload.parse(raw)).toStrictEqual([
		{ role: 'assistant', text: 'hi', timestamp: '2026-07-08T13:45:00.000Z' },
	])
})

test('parses a legacy message that predates the timestamp field', () => {
	const raw = '[{"role":"assistant","text":"hi"}]'

	expect(chat_log_payload.parse(raw)).toStrictEqual([{ role: 'assistant', text: 'hi' }])
})

test('keeps an error detail sub-message on an assistant message', () => {
	const raw =
		'[{"role":"assistant","text":"Something went wrong.","detail":"[500] ai search down"}]'

	expect(chat_log_payload.parse(raw)).toStrictEqual([
		{ role: 'assistant', text: 'Something went wrong.', detail: '[500] ai search down' },
	])
})

test('filters out a message whose detail is not a string', () => {
	const raw = '[{"role":"assistant","text":"ok","detail":42}]'

	expect(chat_log_payload.parse(raw)).toStrictEqual([])
})

test('filters out a message whose timestamp is not a string', () => {
	const raw = '[{"role":"assistant","text":"ok","timestamp":42}]'

	expect(chat_log_payload.parse(raw)).toStrictEqual([])
})

test('filters out elements with an invalid role or non-string text', () => {
	const raw =
		'[{"role":"user","text":"ok"},{"role":"system","text":"bad"},{"role":"assistant","text":42},null,"nope"]'

	expect(chat_log_payload.parse(raw)).toStrictEqual([{ role: 'user', text: 'ok' }])
})

test('returns an empty array for an empty array input', () => {
	expect(chat_log_payload.parse('[]')).toStrictEqual([])
})

test('logs parse errors so corrupted storage is observable', () => {
	expect.assertions(1)
	const error_spy = vi.spyOn(logger, 'error')

	try {
		chat_log_payload.parse('not json')
		expect(error_spy).toHaveBeenCalledWith('Failed to parse chat log:', expect.any(SyntaxError))
	} finally {
		error_spy.mockRestore()
	}
})
