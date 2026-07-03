// Escapes the five markup-significant characters. Uses the numeric apostrophe entity (&#39;),
// which is valid in both HTML and XML, so this single helper serves both contexts.
function escape_markup(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;')
}

const markup = { escape: escape_markup }

export { markup }
