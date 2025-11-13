import type { Interface } from 'node:readline/promises'

type Operation = 'commit' | 'push' | 'pr'

const OPERATION_LABELS: Record<Operation, string> = {
	commit: '🧱 Commit',
	push: '📤 Push',
	pr: '🔀 PR',
}

interface OperationPromptConfig {
	operation: Operation
	leading_newline?: boolean
}

const OPERATION_PROMPT_CONFIGS: Record<Operation, OperationPromptConfig> = {
	commit: { operation: 'commit', leading_newline: true },
	push: { operation: 'push', leading_newline: false },
	pr: { operation: 'pr', leading_newline: false },
}

function normalize_yes_no_answer(raw_answer: string): 'y' | 'n' | undefined {
	const answer = raw_answer.trim().toLowerCase()
	if (answer === 'y' || answer === 'n') return answer
	return undefined
}

function build_operation_prompt(
	operation: Operation,
	options?: { with_leading_newline?: boolean },
): string {
	const prefix = options?.with_leading_newline === true ? '\n' : ''
	return `${prefix}${OPERATION_LABELS[operation]}? (y/n): `
}

function log_operation_summary(operations: Record<Operation, boolean>): void {
	console.info('\n🧭 Config:')
	for (const operation of Object.keys(OPERATION_PROMPT_CONFIGS) as Array<Operation>) {
		const is_enabled = operations[operation]
		console.info(`  ${OPERATION_LABELS[operation]}: ${is_enabled ? '✅' : '⛔️'}`)
	}
}

async function ask_yes_no_binary(prompt: Interface, question: string): Promise<boolean> {
	for (;;) {
		const raw_answer = await prompt.question(question)
		const normalized = normalize_yes_no_answer(raw_answer)
		if (normalized !== undefined) {
			return normalized === 'y'
		}
		console.info('Reply y / n.')
	}
}

async function prompt_operations_once(prompt: Interface): Promise<Record<Operation, boolean>> {
	const prompt_entries = Object.entries(OPERATION_PROMPT_CONFIGS) as Array<
		[Operation, OperationPromptConfig]
	>
	const selections = await Promise.all(
		prompt_entries.map(async ([operation, config]) => {
			const question = build_operation_prompt(
				operation,
				config.leading_newline === true ? { with_leading_newline: true } : undefined,
			)
			const is_enabled = await ask_yes_no_binary(prompt, question)
			return [operation, is_enabled] as const
		}),
	)
	return Object.fromEntries(selections) as Record<Operation, boolean>
}

export type { Operation, OperationPromptConfig }
export const prompt_utilities = {
	OPERATION_LABELS,
	ask_yes_no_binary,
	log_operation_summary,
	prompt_operations_once,
}
