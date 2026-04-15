function parse(raw: string): Array<string> {
	try {
		const parsed: unknown = JSON.parse(raw)
		if (!Array.isArray(parsed)) return []

		return parsed.filter((item): item is string => typeof item === 'string')
	} catch {
		return []
	}
}

const liked_posts_payload = { parse }

export { liked_posts_payload }
