const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const MILLISECONDS_PER_SECOND = 1000

function minutes_to_sec(minutes: number): number {
	return minutes * SECONDS_PER_MINUTE
}

function minutes_to_ms(minutes: number): number {
	return minutes_to_sec(minutes) * MILLISECONDS_PER_SECOND
}

function hours_to_milliseconds(hours: number): number {
	return minutes_to_ms(hours * MINUTES_PER_HOUR)
}

const time_conversion = {
	hours_to_milliseconds,
	minutes_to_ms,
	minutes_to_sec,
}

export { time_conversion }
