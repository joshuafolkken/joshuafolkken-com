import { parse_json_array } from '$lib/utils/parse-json-array'

function is_string(value: unknown): value is string {
	return typeof value === 'string'
}

function parse(raw: string): Array<string> {
	return parse_json_array(raw, is_string, 'Failed to parse liked posts:')
}

const liked_posts_payload = { parse }

export { liked_posts_payload }
