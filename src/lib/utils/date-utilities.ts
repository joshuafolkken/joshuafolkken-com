// en-CA renders the date as ISO-style YYYY-MM-DD; formatToParts then lets us join the fields with a
// fixed separator so the output never depends on the locale's own date/time separator.
const CHAT_TIME_LOCALE = 'en-CA'

function format_date_to_w3c(date: Date): string {
	return date.toISOString()
}

function build_chat_time_options(time_zone: string | undefined): Intl.DateTimeFormatOptions {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		// h23 keeps midnight as 00 (h24 would render it as 24) and avoids a locale AM/PM suffix.
		hourCycle: 'h23',
	}

	if (time_zone !== undefined) options.timeZone = time_zone

	return options
}

type DateParts = Array<Intl.DateTimeFormatPart>

function part_value(parts: DateParts, type: Intl.DateTimeFormatPartTypes): string {
	return parts.find((part) => part.type === type)?.value ?? ''
}

function join_parts(parts: DateParts): string {
	const date_part = `${part_value(parts, 'year')}-${part_value(parts, 'month')}-${part_value(parts, 'day')}`
	const time_part = `${part_value(parts, 'hour')}:${part_value(parts, 'minute')}`

	return `${date_part} ${time_part}`
}

// Formats an ISO 8601 timestamp as "YYYY-MM-DD HH:MM" in the given time zone (the runtime's local zone
// when omitted). Returns '' for an unparseable input so callers can skip rendering rather than show NaN.
function format_chat_time(iso: string, time_zone?: string): string {
	const date = new Date(iso)

	if (Number.isNaN(date.getTime())) return ''

	const formatter = new Intl.DateTimeFormat(CHAT_TIME_LOCALE, build_chat_time_options(time_zone))

	return join_parts(formatter.formatToParts(date))
}

// Strips the optional " HH:MM" time portion, leaving the leading YYYY-MM-DD for date-only display.
function format_date_only(value: string): string {
	return value.split(' ', 1)[0] ?? ''
}

const date_utilities = {
	format_date_to_w3c,
	format_chat_time,
	format_date_only,
}

export { date_utilities }
