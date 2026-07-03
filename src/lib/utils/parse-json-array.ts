import { logger } from '$lib/logger'

// Parses a JSON string expected to hold an array, keeping only the items that pass the guard.
// Returns [] for non-array roots or malformed JSON, logging the failure under error_label.
function parse_json_array<Item>(
	raw: string,
	is_item: (value: unknown) => value is Item,
	error_label: string,
): Array<Item> {
	try {
		const parsed: unknown = JSON.parse(raw)
		if (!Array.isArray(parsed)) return []

		return parsed.filter(is_item)
	} catch (error) {
		logger.error(error_label, error)

		return []
	}
}

export { parse_json_array }
