import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { git_utilities } from './constants'

const exec_async = promisify(exec)

async function exec_git_command(command: string): Promise<string> {
	const git_command: string = git_utilities.get_git_command()
	const { stdout } = (await exec_async(`${git_command} ${command}`)) as {
		stdout: string
		stderr: string
	}

	return stdout.trimEnd()
}

function create_spawn_error(command: string, exit_code: number | null): Error {
	const exit_code_string = exit_code === null ? 'unknown' : String(exit_code)
	const error_message = `git ${command} exited with code ${exit_code_string}`
	const error = new Error(error_message)

	error.cause = { exit_code: exit_code_string }

	return error
}

async function exec_git_command_with_output(
	command: string,
	arguments_list: Array<string>,
): Promise<void> {
	const git_command: string = git_utilities.get_git_command_for_spawn()

	await new Promise<void>((resolve, reject) => {
		const child = spawn(git_command, [command, ...arguments_list], {
			stdio: 'inherit',
			shell: false,
		})

		child.on('error', (error) => {
			reject(error)
		})

		child.on('close', (code) => {
			if (code === 0) {
				resolve()
			} else {
				reject(create_spawn_error(command, code))
			}
		})
	})
}

async function branch(): Promise<string> {
	return await exec_git_command('rev-parse --abbrev-ref HEAD')
}

async function status(): Promise<string> {
	return await exec_git_command('status --porcelain')
}

async function diff_cached(file_path: string): Promise<string> {
	try {
		return await exec_git_command(`diff --cached ${file_path}`)
	} catch {
		return ''
	}
}

async function checkout_b(branch_name: string): Promise<string> {
	return await exec_git_command(`checkout -b ${branch_name}`)
}

async function checkout(branch_name: string): Promise<string> {
	return await exec_git_command(`checkout ${branch_name}`)
}

async function commit(message: string): Promise<void> {
	const safe_message = JSON.stringify(message)

	await exec_git_command_with_output('commit', ['-m', safe_message])
}

function is_upstream_not_set_error(error: unknown): boolean {
	if (!(error instanceof Error) || error.cause === undefined) {
		return false
	}

	const cause = error.cause as { exit_code?: string }

	return cause.exit_code === '128'
}

async function push_with_upstream(branch_name: string): Promise<void> {
	await exec_git_command_with_output('push', ['--set-upstream', 'origin', branch_name])
}

async function push(): Promise<void> {
	try {
		await exec_git_command_with_output('push', [])
	} catch (error) {
		if (is_upstream_not_set_error(error)) {
			const current_branch = await branch()

			await push_with_upstream(current_branch)

			return
		}

		throw error
	}
}

async function branch_exists(branch_name: string): Promise<boolean> {
	try {
		const output: string = await exec_git_command(`branch --list ${branch_name}`)

		return output.trim().length > 0
	} catch {
		return false
	}
}

const git_command = {
	branch,
	status,
	diff_cached,
	checkout_b,
	checkout,
	commit,
	push,
	branch_exists,
}

export { git_command }
