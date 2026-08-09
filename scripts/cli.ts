/**
 * Shared CLI-argument helpers for the `scripts/` entry points, single-sourced so each
 * command validates its positional arguments the same way.
 */

interface PositionalInput {
	value: string
	rest: ReadonlyArray<string>
}

// Returns the first positional argument, throwing the command's usage string when it is absent.
function read_required_argument(args: ReadonlyArray<string>, usage: string): string {
	const [value] = args

	if (!value) throw new Error(usage)

	return value
}

// Splits `<required> [extra...]` positional arguments for the commands that take optional trailing
// paths after their subject, so `yt:article` and `yt:talk` parse the same shape from one place.
// `max_rest` is enforced here rather than by each caller: a trailing path beyond what the command
// reads would otherwise be discarded in silence, which is the failure these commands exist to avoid.
function read_argument_with_rest(
	args: ReadonlyArray<string>,
	usage: string,
	max_rest: number,
): PositionalInput {
	const value = read_required_argument(args, usage)
	const rest = args.slice(1)

	if (rest.length > max_rest) throw new Error(usage)

	return { value, rest }
}

const cli = {
	read_required_argument,
	read_argument_with_rest,
}

export type { PositionalInput }
export { cli }
