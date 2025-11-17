function handle(error: unknown): void {
	const error_message = error instanceof Error ? error.message : String(error)
	console.error('')
	console.error('❌ Error:', error_message)
	console.error('')
	process.exit(1)
}

const git_error = {
	handle,
}

export { git_error }
