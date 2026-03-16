const MAX_LOG_VALUE_LENGTH = 80
const FUNCTION_STRING = '[Function]'

function is_null_or_undefined(value: unknown): value is null | undefined {
	return value === null || value === undefined
}

function is_function(value: unknown): value is (...arguments_: Array<unknown>) => unknown {
	return typeof value === 'function'
}

function is_primitive(value: unknown): value is string | number | boolean | symbol | bigint {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		typeof value === 'symbol' ||
		typeof value === 'bigint'
	)
}

function stringify_primitive(value: string | number | boolean | symbol | bigint): string {
	return typeof value === 'symbol' ? value.toString() : String(value)
}

function stringify_base(value: unknown, object_handler: (target_object: object) => string): string {
	if (is_null_or_undefined(value)) return String(value)
	if (is_function(value)) return FUNCTION_STRING
	if (typeof value === 'object') return object_handler(value)
	if (is_primitive(value)) return stringify_primitive(value)

	return 'unknown'
}

function stringify_value_rich(value: unknown): string {
	return stringify_base(value, (target_object) => JSON.stringify(target_object))
}

function stringify_value_safe(value: unknown): string {
	return stringify_base(value, () => '[object Object]')
}

function truncate_for_log(string_value: string): string {
	const without_newlines = string_value.replaceAll('\n', ' ')
	const is_truncated = without_newlines.length > MAX_LOG_VALUE_LENGTH

	return is_truncated ? `${without_newlines.slice(0, MAX_LOG_VALUE_LENGTH)}...` : without_newlines
}

function format_value_for_log(value: unknown): string {
	try {
		return truncate_for_log(stringify_value_rich(value))
	} catch {
		return truncate_for_log(stringify_value_safe(value))
	}
}

function format_elapsed_ms(started_at: number): string {
	const duration = Date.now() - started_at

	return `${String(duration)}ms`
}

const cache_log_utilities = {
	format_elapsed_ms,
	format_value_for_log,
}

export { cache_log_utilities }
