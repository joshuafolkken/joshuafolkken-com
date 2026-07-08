import { expect, test } from 'vitest'
import { date_utilities } from './date-utilities'

const ISO_1345_UTC = '2026-07-08T13:45:00.000Z'
const UTC = 'UTC'

test('format_date_to_w3c returns the ISO 8601 string of a date', () => {
	expect(date_utilities.format_date_to_w3c(new Date(ISO_1345_UTC))).toBe(ISO_1345_UTC)
})

test('format_chat_time renders an ISO instant as "YYYY-MM-DD HH:MM" in the given time zone', () => {
	expect(date_utilities.format_chat_time(ISO_1345_UTC, UTC)).toBe('2026-07-08 13:45')
})

test('format_chat_time keeps midnight as 00, not 24', () => {
	expect(date_utilities.format_chat_time('2026-07-08T00:05:00.000Z', UTC)).toBe('2026-07-08 00:05')
})

test('format_chat_time shifts the wall-clock time into the requested time zone', () => {
	// 13:45 UTC is 22:45 the same day in Tokyo (UTC+9).
	expect(date_utilities.format_chat_time(ISO_1345_UTC, 'Asia/Tokyo')).toBe('2026-07-08 22:45')
})

test('format_chat_time returns an empty string for an unparseable timestamp', () => {
	expect(date_utilities.format_chat_time('not-a-date', UTC)).toBe('')
})
