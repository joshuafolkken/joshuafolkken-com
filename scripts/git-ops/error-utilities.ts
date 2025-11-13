class AutomationError extends Error {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options)
		this.name = 'AutomationError'
	}
}

function format_failure_message(summary: string, details?: string): string {
	if (details === undefined) {
		return summary
	}

	const trimmed_details = details.trim()
	if (trimmed_details.length === 0) {
		return summary
	}

	return `${summary}\n${trimmed_details}`
}

function build_retry_failure_error(label: string, details?: string): AutomationError {
	return new AutomationError(format_failure_message(label, details))
}

export { AutomationError }

export const error_utilities = {
	build_retry_failure_error,
	format_failure_message,
}
