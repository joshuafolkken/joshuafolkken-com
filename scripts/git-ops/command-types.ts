interface CommandOptions {
	stdio?: 'pipe' | 'inherit'
	should_allow_non_zero_exit?: boolean
	description?: string
	env?: NodeJS.ProcessEnv
	should_lead_with_blank_line?: boolean
}

interface CommandResult {
	stdout: string
	stderr: string
	status: number
}

export type { CommandOptions, CommandResult }
