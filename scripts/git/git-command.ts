import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { git_utilities } from './constants.js'

const exec_async = promisify(exec)

async function exec_git_command(command: string): Promise<string> {
	const git_command: string = git_utilities.get_git_command()
	const { stdout } = (await exec_async(`${git_command} ${command}`)) as {
		stdout: string
		stderr: string
	}
	return stdout.trimEnd()
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

const git_command = {
	branch,
	status,
	diff_cached,
	checkout_b,
}

export { git_command }
