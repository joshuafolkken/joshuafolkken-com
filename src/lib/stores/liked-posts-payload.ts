import { logger } from '$lib/logger'

function parse(raw: string): Array<string> {
	try {
		const parsed: unknown = JSON.parse(raw)
		if (!Array.isArray(parsed)) return []

		return parsed.filter((item): item is string => typeof item === 'string')
	} catch (error) {
		logger.error('Failed to parse liked posts:', error)

		return []
	}
}

const liked_posts_payload = { parse }

export { liked_posts_payload }
