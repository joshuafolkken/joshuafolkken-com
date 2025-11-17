import { stdin as input, stdout as output } from 'node:process'
import { createInterface, type Interface } from 'node:readline/promises'
import { SEPARATOR_LINE } from './constants.js'

function display_start_separator(): void {
	console.info('')
	console.info(SEPARATOR_LINE)
}

function display_end_separator(): void {
	console.info(SEPARATOR_LINE)
	console.info('')
}

function display_invalid_answer_message(): void {
	console.info('💡 Reply y / n.')
}

function is_valid_yes_no_answer(answer: string): boolean {
	return answer === 'y' || answer === 'n'
}

async function ask_yes_no_internal(
	prompt: Interface,
	question: string,
	is_first_call: boolean,
): Promise<boolean> {
	if (is_first_call) {
		display_start_separator()
	}
	const raw_answer: unknown = await prompt.question(question)
	const answer = String(raw_answer).trim().toLowerCase()

	if (!is_valid_yes_no_answer(answer)) {
		display_invalid_answer_message()
		return await ask_yes_no_internal(prompt, question, false)
	}

	display_end_separator()
	return answer === 'y'
}

async function ask_yes_no(prompt: Interface, question: string): Promise<boolean> {
	return await ask_yes_no_internal(prompt, question, true)
}

function create_prompt(): Interface | undefined {
	return process.stdin.isTTY ? createInterface({ input, output }) : undefined
}

function handle_prompt_fallback<T>(fallback_value?: T): T {
	if (fallback_value !== undefined) {
		return fallback_value
	}
	throw new Error('TTY not available')
}

async function with_prompt<T>(
	callback: (prompt: Interface) => Promise<T>,
	fallback_value?: T,
): Promise<T> {
	const prompt = create_prompt()

	if (prompt === undefined) {
		return handle_prompt_fallback(fallback_value)
	}

	try {
		// eslint-disable-next-line promise/prefer-await-to-callbacks
		return await callback(prompt)
	} finally {
		prompt.close()
	}
}

async function confirm_continue(): Promise<boolean> {
	return await with_prompt(
		async (prompt) => await ask_yes_no(prompt, '💬 Unstaged files found. Continue anyway? (y/n): '),
		false,
	)
}

async function confirm_unstaged_files(): Promise<void> {
	const should_continue = await confirm_continue()
	if (!should_continue) {
		console.info('💡 Operation cancelled.')
		console.info('')
		process.exit(1)
	}
}

async function ask_issue_info(prompt: Interface, question: string): Promise<string> {
	display_start_separator()
	const raw_answer: unknown = await prompt.question(question)
	const answer = String(raw_answer)
	display_end_separator()
	return answer.trim()
}

async function get_issue_info(): Promise<string> {
	return await with_prompt(async (prompt) => {
		const result: string = await ask_issue_info(
			prompt,
			'💬 Enter issue title and number (e.g., "title #52"): ',
		)
		return result
	})
}

const git_prompt = {
	confirm_continue,
	confirm_unstaged_files,
	get_issue_info,
}

export { git_prompt }
