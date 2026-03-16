import { dev } from '$app/environment'
import { time_conversion } from '$lib/time-conversion'

const JST_OFFSET_HOURS = 9
const ISO_DATE_WITH_MS_LENGTH = 23

function get_timestamp(): string {
	const now = new Date()
	const jst_now = new Date(now.getTime() + time_conversion.hours_to_milliseconds(JST_OFFSET_HOURS))

	return jst_now.toISOString().replace('T', ' ').slice(0, ISO_DATE_WITH_MS_LENGTH)
}

function format_log(level: string, arguments_: Array<unknown>): Array<unknown> {
	if (dev) {
		return [`[${get_timestamp()}] [${level}]`, ...arguments_]
	}

	return arguments_
}

function debug(...arguments_: Array<unknown>): void {
	if (dev) {
		console.debug(...format_log('DEBUG', arguments_)) // eslint-disable-line no-console
	}
}

function info(...arguments_: Array<unknown>): void {
	console.info(...format_log('INFO', arguments_)) // eslint-disable-line no-console
}

function warn(...arguments_: Array<unknown>): void {
	console.warn(...format_log('WARN', arguments_)) // eslint-disable-line no-console
}

function error(...arguments_: Array<unknown>): void {
	console.error(...format_log('ERROR', arguments_)) // eslint-disable-line no-console
}

export const logger = { debug, info, warn, error }
