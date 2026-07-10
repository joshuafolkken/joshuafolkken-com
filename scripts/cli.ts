/**
 * Shared CLI-argument helpers for the `scripts/` entry points, single-sourced so each
 * command validates its positional arguments the same way.
 */

// Returns the first positional argument, throwing the command's usage string when it is absent.
function read_required_argument(args: ReadonlyArray<string>, usage: string): string {
	const [value] = args

	if (!value) throw new Error(usage)

	return value
}

const cli = {
	read_required_argument,
}

export { cli }
