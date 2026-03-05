const SLUG_MAX_LENGTH = 200
const SLUG_PATTERN = /^[\w-]+$/u

function parse_slug(value: unknown): string | undefined {
	if (typeof value !== 'string' || value.trim().length === 0) {
		return undefined
	}

	const trimmed = value.trim()

	if (trimmed.length > SLUG_MAX_LENGTH || !SLUG_PATTERN.test(trimmed)) {
		return undefined
	}

	return trimmed
}

function is_slug_missing(raw_slug: string | null): boolean {
	return raw_slug === null || (typeof raw_slug === 'string' && raw_slug.trim() === '')
}

const slug_validator = {
	is_slug_missing,
	parse_slug,
}

export { slug_validator }
