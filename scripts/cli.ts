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

// Parses an optional `[count]` positional. Out of range is refused rather than clamped: the
// generator bills one image per candidate, so a silently clamped count would charge for a run
// nobody asked for, and the stock collector inherits the same rule so both commands answer a
// mistyped argument the same way instead of one of them guessing.
function parse_count(
	raw: string | undefined,
	usage: string,
	default_count: number,
	max_count: number,
): number {
	if (raw === undefined) return default_count

	const count = Number(raw)

	if (!Number.isSafeInteger(count) || count < 1 || count > max_count) {
		throw new Error(`${usage}\n  count must be an integer from 1 to ${String(max_count)}`)
	}

	return count
}

const cli = {
	read_required_argument,
	read_argument_with_rest,
	parse_count,
}

export type { PositionalInput }
export { cli }
