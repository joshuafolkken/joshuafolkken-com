function format_date_to_w3c(date: Date): string {
	return date.toISOString()
}

const date_utilities = {
	format_date_to_w3c,
}

export { date_utilities }
