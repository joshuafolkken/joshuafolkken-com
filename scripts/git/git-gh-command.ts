import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'

const exec_async = promisify(exec)

async function exec_gh_command(command: string): Promise<string> {
	try {
		const { stdout } = (await exec_async(`gh ${command}`)) as {
			stdout: string
			stderr: string
		}
		return stdout.trimEnd()
	} catch (error) {
		const exec_error = error as { stderr?: string; stdout?: string; message?: string }
		const error_message = exec_error.message ?? String(error)
		const stderr = exec_error.stderr ?? ''
		const combined_message = stderr.length > 0 ? `${error_message}\n${stderr}` : error_message
		throw new Error(combined_message)
	}
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
	try {
		return await exec_gh_command(`pr checks ${branch_name}`)
	} catch (error) {
		const exec_error = error as { stderr?: string; stdout?: string }
		if (exec_error.stderr !== undefined && exec_error.stderr.length > 0) {
			throw new Error(exec_error.stderr)
		}
		throw error
	}
}

async function pr_checks_watch(branch_name: string): Promise<void> {
	await new Promise<void>((resolve, reject) => {
		// eslint-disable-next-line sonarjs/no-os-command-from-path -- gh is a well-known CLI tool and safe to execute
		const child = spawn('gh', ['pr', 'checks', branch_name, '--watch'], {
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
				const exit_code = code === null ? 'unknown' : String(code)
				reject(new Error(`gh pr checks --watch exited with code ${exit_code}`))
			}
		})
	})
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

const git_gh_command = {
	pr_create,
	pr_checks,
	pr_checks_watch,
	pr_exists,
	pr_view,
}

export { git_gh_command }
