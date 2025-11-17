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

async function checkout(branch_name: string): Promise<string> {
	return await exec_git_command(`checkout ${branch_name}`)
}

async function commit(message: string): Promise<string> {
	const safe_message = JSON.stringify(message)
	return await exec_git_command(`commit -m ${safe_message}`)
}

async function push(): Promise<string> {
	return await exec_git_command('push')
}

async function branch_exists(branch_name: string): Promise<boolean> {
	try {
		const output: string = await exec_git_command(`branch --list ${branch_name}`)
		return output.trim().length > 0
	} catch {
		return false
	}
}

async function exec_gh_command(command: string): Promise<string> {
	const { stdout } = (await exec_async(`gh ${command}`)) as {
		stdout: string
		stderr: string
	}
	return stdout.trimEnd()
}

function is_pr_already_exists_message(error_message: string): boolean {
	return error_message.toLowerCase().includes('already exists')
}

function get_error_message_with_stderr(error: unknown): string {
	if (error instanceof Error) {
		const exec_error = error as { stderr?: string }
		if (exec_error.stderr !== undefined && exec_error.stderr.length > 0) {
			return `${error.message}\n${exec_error.stderr}`
		}
		return error.message
	}
	return String(error)
}

function handle_pr_create_error(error: unknown): never {
	const error_message = get_error_message_with_stderr(error)
	if (is_pr_already_exists_message(error_message)) {
		throw new Error('PR_ALREADY_EXISTS')
	}
	throw error
}

async function pr_create(title: string, body: string): Promise<string> {
	const safe_title = JSON.stringify(title)
	const safe_body = JSON.stringify(body)
	try {
		return await exec_gh_command(
			`pr create --title ${safe_title} --body ${safe_body} --label enhancement --base main`,
		)
	} catch (error) {
		return handle_pr_create_error(error)
	}
}

async function pr_checks(branch_name: string): Promise<string> {
	return await exec_gh_command(`pr checks ${branch_name}`)
}

async function pr_checks_watch(branch_name: string): Promise<string> {
	return await exec_gh_command(`pr checks ${branch_name} --watch`)
}

async function pr_exists(branch_name: string): Promise<boolean> {
	try {
		await exec_gh_command(`pr view ${branch_name}`)
		return true
	} catch {
		return false
	}
}

async function pr_view(branch_name: string): Promise<string> {
	try {
		return await exec_gh_command(
			`pr view ${branch_name} --json mergeable,mergeStateStatus,state --jq .`,
		)
	} catch {
		return ''
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
	pr_create,
	pr_checks,
	pr_checks_watch,
	pr_exists,
	pr_view,
}

export { git_command }
