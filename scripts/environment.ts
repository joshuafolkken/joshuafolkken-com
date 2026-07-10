/**
 * Shared environment-variable helpers for the `scripts/` CLIs.
 *
 * Single-sourced so every script reads env the same way instead of re-implementing
 * the "required / optional-with-default / raw" trio locally.
 */

// Reads a mandatory variable, treating both unset and empty string as missing so a blank
// value in a partially-filled `.env` fails loudly instead of silently flowing downstream.
function require_environment(name: string): string {
	const value = process.env[name]

	if (value === undefined || value === '') throw new Error(`Missing required env: ${name}`)

	return value
}

// Reads an optional variable, falling back to the default when unset or empty.
function optional_environment(name: string, fallback: string): string {
	const value = process.env[name]

	return value === undefined || value === '' ? fallback : value
}

// Reads a variable that may legitimately be absent (returns undefined, empty preserved as-is).
function read_environment(name: string): string | undefined {
	return process.env[name]
}

const environment = {
	require_environment,
	optional_environment,
	read_environment,
}

export { environment }
