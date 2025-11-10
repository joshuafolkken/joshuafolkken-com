#!/usr/bin/env node
import { spawnSync, type SpawnSyncOptions } from 'node:child_process'
import { stdin as input, stdout as output, exit } from 'node:process'
import { createInterface, Interface } from 'node:readline/promises'
import { EOL } from 'node:os'

type Operation = 'commit' | 'push' | 'pr'

interface AutomationConfig {
	issueTitle: string
	issueNumber: string
	targetBranch: string
	operations: Record<Operation, boolean>
}

interface CommandOptions {
	stdio?: 'pipe' | 'inherit'
	allowNonZeroExit?: boolean
	description?: string
	env?: NodeJS.ProcessEnv
	leadingBlankLine?: boolean
}

interface CommandResult {
	stdout: string
	stderr: string
	status: number
}

class AutomationError extends Error {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options)
		this.name = 'AutomationError'
	}
}

async function readPipedInput(): Promise<string | undefined> {
	if (input.isTTY) {
		return undefined
	}

	return new Promise<string>((resolve) => {
		let data = ''
		input.setEncoding('utf8')
		input.on('data', (chunk: string) => {
			data += chunk
		})
		input.on('end', () => {
			resolve(data)
		})
	})
}

function ensurePromptInterface(prompt: Interface | undefined): Interface {
	if (prompt === undefined) {
		throw new AutomationError('Interactive input is required. Please rerun this script in a TTY environment.')
	}
	return prompt
}

async function readIssueLine(prompt: Interface | undefined): Promise<string> {
	const pipedInput = await readPipedInput()

	if (pipedInput !== undefined) {
		const rawLines = pipedInput
			.split(/\r?\n/u)
			.map((line) => line.trim())
			.filter((line) => line.length > 0)

		const lines = rawLines[0]?.trim() === '@git-automation.md' ? rawLines.slice(1) : rawLines

		if (lines.length < 1) {
			throw new AutomationError('Input is missing. Please provide a line that includes issue information.')
		}

		return lines[0] ?? ''
	}

	const rl = ensurePromptInterface(prompt)
	const issueLine = await rl.question('\nIssue info (<title> #<number>): ')

	return issueLine.trim()
}

function parseIssueLine(line: string): { issueTitle: string; issueNumber: string } {
	const normalized = line.replace(/^issue:\s*/iu, '').trim()
	const hashIndex = normalized.lastIndexOf('#')

	if (hashIndex <= 0) {
		throw new AutomationError('Issue information is malformed. Use the format `<title> #<number>`.')
	}

	const rawTitle = normalized.slice(0, hashIndex).trim()
	const rawNumber = normalized.slice(hashIndex + 1).trim()
	const numberMatch = rawNumber.match(/\d+/u)

	if (rawTitle.length === 0 || numberMatch === null) {
		throw new AutomationError('Issue information is malformed. Check the title and number.')
	}

	return {
		issueTitle: rawTitle,
		issueNumber: numberMatch[0] ?? '',
	}
}

function sanitizeBranchSlug(title: string): string {
	const replaced = title
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[^a-z0-9]+/gu, '-')
		.replace(/-+/gu, '-')
		.replace(/^-|-$/gu, '')

	return replaced.length === 0 ? 'update' : replaced
}

function generateTargetBranch(issueTitle: string, issueNumber: string): string {
	const slug = sanitizeBranchSlug(issueTitle)
	return `${issueNumber}-${slug}`
}

function parseAutomationConfig(issueLine: string): AutomationConfig {
	const { issueTitle, issueNumber } = parseIssueLine(issueLine)
	const targetBranch = generateTargetBranch(issueTitle, issueNumber)

	return {
		issueTitle,
		issueNumber,
		targetBranch,
		operations: {
			commit: false,
			push: false,
			pr: false,
		},
	}
}

function runCommand(command: string, args: string[], options: CommandOptions = {}): CommandResult {
	const { stdio = 'pipe', allowNonZeroExit = false, env, description, leadingBlankLine = false } = options
	const startMessage = description !== undefined ? `▶ ${description} ...` : undefined
	const inlineStatus = startMessage !== undefined && stdio === 'pipe'
	if (startMessage !== undefined) {
		if (leadingBlankLine) {
			if (inlineStatus) {
				process.stdout.write(EOL)
			} else {
				console.log('')
			}
		}
		if (inlineStatus) {
			process.stdout.write(startMessage)
		} else {
			console.log(startMessage) // eslint-disable-line no-console
		}
	}

	const spawnOptions: SpawnSyncOptions = {
		stdio: stdio === 'pipe' ? ['ignore', 'pipe', 'pipe'] : 'inherit',
		encoding: stdio === 'pipe' ? 'utf8' : undefined,
		env: env === undefined ? process.env : { ...process.env, ...env },
	}

	const result = spawnSync(command, args, spawnOptions)

	if (result.error) {
		throw new AutomationError(
			description !== undefined ? `${description} failed: ${result.error.message}` : result.error.message,
			{ cause: result.error }
		)
	}

	const status = result.status ?? 0
	const stdout = typeof result.stdout === 'string' ? result.stdout : ''
	const stderr = typeof result.stderr === 'string' ? result.stderr : ''

	if (!allowNonZeroExit && status !== 0) {
		const message =
			description !== undefined
				? `${description} failed.${stderr.trim().length > 0 ? `\n${stderr.trim()}` : ''}`
				: `Command execution failed: ${command} ${args.join(' ')}`
		if (description !== undefined) {
			const failMessage = `✗ ${description} ... failed`
			if (inlineStatus) {
				const padding = startMessage.length > failMessage.length ? ' '.repeat(startMessage.length - failMessage.length) : ''
				process.stdout.write(`\r${failMessage}${padding}\n`)
			} else {
				if (leadingBlankLine) {
					console.error('')
				}
				console.error(failMessage) // eslint-disable-line no-console
			}
		}
		throw new AutomationError(message)
	}

	if (description !== undefined && (allowNonZeroExit || status === 0)) {
		const successMessage = `✓ ${description} ... complete`
		if (inlineStatus) {
			const padding = startMessage.length > successMessage.length ? ' '.repeat(startMessage.length - successMessage.length) : ''
			process.stdout.write(`\r${successMessage}${padding}\n`)
		} else {
			if (leadingBlankLine) {
				console.log('')
			}
			console.log(successMessage) // eslint-disable-line no-console
		}
	}

	return { stdout, stderr, status }
}

async function waitFor(milliseconds: number): Promise<void> {
	await new Promise((resolve) => {
		setTimeout(resolve, milliseconds)
	})
}

function fetchPrChecksOutput(branch: string): { status: number; output: string } {
	const result = runCommand('gh', ['pr', 'checks', branch], {
		stdio: 'pipe',
		allowNonZeroExit: true,
	})

	const output = [result.stdout, result.stderr]
		.filter((value) => value !== undefined && value.trim().length > 0)
		.join('\n')

	return {
		status: result.status,
		output: output.trim(),
	}
}

function isExistingPullRequestMessage(output: string): boolean {
	const normalized = output.toLowerCase()
	return normalized.includes('pull request') && normalized.includes('already exists')
}

function isNoChecksReportedMessage(output: string): boolean {
	return output.toLowerCase().includes('no checks reported')
}

function ensureCommandExists(command: string): void {
	const result = spawnSync(command, ['--version'], { stdio: 'ignore' })

	if (result.error !== undefined || result.status !== 0) {
		throw new AutomationError(
			`⚠️ ${command} is not installed. Install it if necessary and rerun this script.`
		)
	}
}

function ensureStagingState(): void {
	const { stdout } = runCommand('git', ['status', '--porcelain'], { description: 'Check staging status' })

	const lines = stdout
		.split(/\r?\n/u)
		.map((line) => line.replace(/\s+$/u, ''))
		.filter((line) => line.length > 0)

	const hasUntracked = lines.some((line) => line.startsWith('??'))
	const hasUnstaged = lines.some((line) => line.length >= 2 && line[1] !== ' ')

	if (hasUntracked || hasUnstaged) {
		throw new AutomationError(
			[
				'🚫 Not all changes are staged.',
				'Stage your changes with:',
				'  git add .',
				'Rerun this script after staging.',
			].join(EOL)
		)
	}
}

function getCurrentBranch(): string {
	const { stdout } = runCommand('git', ['branch', '--show-current'], {
		description: 'Get current branch',
	})
	return stdout.trim()
}

function extractIssueNumberFromBranch(branch: string): string | undefined {
	const match = /^(\d+)-/u.exec(branch)
	return match?.[1]
}

function ensureBranchMatchesIssue(branch: string, issueNumber: string): void {
	if (branch === 'main' || branch === 'master') {
		return
	}

	const branchIssue = extractIssueNumberFromBranch(branch)
	if (branchIssue !== undefined && branchIssue !== issueNumber) {
		throw new AutomationError(
			[
				'🚫 The issue number does not match the branch number.',
				`  Issue number: #${issueNumber}`,
				`  Current branch: ${branch}`,
				'Switch to the correct branch or create a new one, then rerun this script.',
			].join(EOL)
		)
	}
}

function ensureMainIsUpdated(branch: string): void {
	const target = branch === 'master' ? 'master' : 'main'
	runCommand('git', ['pull', 'origin', target], {
		stdio: 'inherit',
		description: `Pull latest ${target} branch`,
	})
}

function checkoutBranch(branch: string): void {
	runCommand('git', ['checkout', branch], {
		stdio: 'inherit',
		description: `Switch to branch ${branch}`,
	})
}

function createBranch(branch: string): void {
	runCommand('git', ['checkout', '-b', branch], {
		stdio: 'inherit',
		description: `Create branch ${branch}`,
	})
}

function ensureIssueMatches(config: AutomationConfig): void {
	ensureCommandExists('gh')

	const { stdout } = runCommand(
		'gh',
		['issue', 'view', config.issueNumber, '--json', 'title', '--jq', '.title'],
		{
			description: 'Validate issue information',
		}
	)

	const githubTitle = stdout.trim()
	if (githubTitle.length === 0) {
		throw new AutomationError(`🚫 Issue #${config.issueNumber} was not found.`)
	}

	if (githubTitle !== config.issueTitle) {
		throw new AutomationError(
			[
				'🚫 Issue title does not match.',
				`  Provided title: ${config.issueTitle}`,
				`  GitHub title:   ${githubTitle}`,
				'Verify the issue number and title.',
			].join(EOL)
		)
	}
}

function getStagedFiles(): string[] {
	const { stdout } = runCommand('git', ['diff', '--cached', '--name-only'], {
		description: 'Get staged files',
	})
	return stdout
		.split(/\r?\n/u)
		.map((line) => line.trim())
		.filter((line) => line.length > 0)
}

async function ensurePackageJsonVersion(prompt: Interface | undefined): Promise<void> {
	const stagedFiles = getStagedFiles()
	const rl = ensurePromptInterface(prompt)

	const hasPackageJson = stagedFiles.includes('package.json')

	if (!hasPackageJson) {
		const shouldContinue = await askYesNoBinary(
			rl,
			'⚠️ package.json is not included in the staged changes. Continue? (y/n): '
		)
		if (!shouldContinue) {
			throw new AutomationError('Operation cancelled by user.')
		}
		return
	}

	const diff = runCommand('git', ['diff', '--cached', 'package.json'], {
		description: 'Inspect package.json diff',
	}).stdout

	const versionChanged = /^[+-]\s*"version"\s*:/gmu.test(diff)

	if (!versionChanged) {
		const shouldContinue = await askYesNoBinary(
			rl,
			'⚠️ The package.json version has not been updated. Continue? (y/n): '
		)
		if (!shouldContinue) {
			throw new AutomationError('Operation cancelled by user.')
		}
	}
}

async function askYesNoBinary(prompt: Interface, question: string): Promise<boolean> {
	const answer = (await prompt.question(question)).trim().toLowerCase()

	if (answer === 'y') {
		return true
	}

	if (answer === 'n') {
		return false
	}

	console.log('Please answer with y or n.') // eslint-disable-line no-console
	return askYesNoBinary(prompt, question)
}

async function configureOperations(prompt: Interface | undefined): Promise<Record<Operation, boolean>> {
	const rl = ensurePromptInterface(prompt)

	while (true) {
		const commit = await askYesNoBinary(rl, '\nRun commit? (y/n): ')
		const push = await askYesNoBinary(rl, 'Push changes? (y/n): ')
		const pr = await askYesNoBinary(rl, 'Create pull request? (y/n): ')

		console.log('\nCurrent configuration:') // eslint-disable-line no-console
		console.log(`- Commit: ${commit ? 'enabled' : 'skipped'}`) // eslint-disable-line no-console
		console.log(`- Push: ${push ? 'enabled' : 'skipped'}`) // eslint-disable-line no-console
		console.log(`- Create PR: ${pr ? 'enabled' : 'skipped'}`) // eslint-disable-line no-console

		const confirm = await askYesNoBinary(rl, 'Proceed with this configuration? (y/n): ')
		if (confirm) {
			return { commit, push, pr }
		}

		console.log('Re-enter configuration.') // eslint-disable-line no-console
	}
}

function runCommit(config: AutomationConfig): void {
	const commitMessage = `${config.issueTitle} #${config.issueNumber}`
	runCommand('git', ['commit', '-m', commitMessage], {
		stdio: 'inherit',
		description: 'Commit',
	})
}

function runPush(branch: string): void {
	runCommand('git', ['push', '-u', 'origin', branch], {
		stdio: 'inherit',
		description: 'Push',
		leadingBlankLine: true,
	})
}

function createPullRequest(config: AutomationConfig): void {
	const title = `${config.issueTitle} #${config.issueNumber}`
	const body = `closes #${config.issueNumber}`
	const description = 'Create PR'

	console.log(`\n▶ ${description} ...`) // eslint-disable-line no-console

	const result = runCommand(
		'gh',
		['pr', 'create', '--title', title, '--body', body, '--label', 'enhancement', '--base', 'main'],
		{
			stdio: 'pipe',
			allowNonZeroExit: true,
		}
	)

	const output = [result.stdout, result.stderr].filter((value) => value !== undefined && value.trim().length > 0).join('\n')

	if (result.status === 0) {
		if (output.length > 0) {
			console.log(output.trim()) // eslint-disable-line no-console
		}
		console.log(`✓ ${description} ... complete`) // eslint-disable-line no-console
		return
	}

	if (isExistingPullRequestMessage(output)) {
		console.log('An existing PR was found. Continuing with the same PR.') // eslint-disable-line no-console
		console.log(`✓ ${description} ... complete`) // eslint-disable-line no-console
		return
	}

	console.log(`✗ ${description} ... failed`) // eslint-disable-line no-console

	throw new AutomationError(`Failed to create PR.${output.length > 0 ? `\n${output.trim()}` : ''}`)
}

async function watchPullRequestChecks(branch: string): Promise<void> {
	const description = 'Wait for status checks'
	const maxAttempts = 5
	const retryDelayMs = 5_000

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		const attemptLabel = `${description} (attempt ${attempt}/${maxAttempts})`
		console.log(`▶ ${attemptLabel} ...`) // eslint-disable-line no-console

		const result = runCommand('gh', ['pr', 'checks', '--watch', branch], {
			stdio: 'inherit',
			allowNonZeroExit: true,
		})

		if (result.status === 0) {
			console.log(`✓ ${attemptLabel} ... complete`) // eslint-disable-line no-console
			return
		}

		const { output } = fetchPrChecksOutput(branch)

		if (output.length > 0) {
			console.log(output) // eslint-disable-line no-console
		}

		if (isNoChecksReportedMessage(output)) {
			if (attempt < maxAttempts) {
				console.log('Status checks are not registered yet. Retrying in a few seconds.') // eslint-disable-line no-console
				await waitFor(retryDelayMs)
				continue
			}

			console.log('Status checks were not registered by the final attempt, continuing anyway.') // eslint-disable-line no-console
			console.log(`✓ ${attemptLabel} ... complete`) // eslint-disable-line no-console
			return
		}

		console.log(`✗ ${attemptLabel} ... failed`) // eslint-disable-line no-console

		throw new AutomationError(`Waiting for status checks failed.${output.length > 0 ? `\n${output}` : ''}`)
	}
}

async function evaluateSonarChecks(branch: string): Promise<{ url?: string; title?: string }> {
	const { stdout } = runCommand('gh', ['pr', 'view', branch, '--json', 'url,title,number'], {
		description: 'Fetch PR details',
	})

	let prInfo: { url?: string; title?: string } = {}
	try {
		prInfo = JSON.parse(stdout) as { url?: string; title?: string }
	} catch (error) {
		throw new AutomationError('Failed to fetch PR details. Unable to parse JSON.', { cause: error })
	}

	const maxAttempts = 5
	const retryDelayMs = 5_000
	let trimmedOutput = ''
	let hasLoggedOutput = false

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		const attemptLabel = `Fetch status check results (attempt ${attempt}/${maxAttempts})`
		console.log(`▶ ${attemptLabel} ...`) // eslint-disable-line no-console

		const { status, output } = fetchPrChecksOutput(branch)
		trimmedOutput = output

		if (status === 0) {
			if (trimmedOutput.length > 0) {
				console.log(trimmedOutput) // eslint-disable-line no-console
				hasLoggedOutput = true
			}
			console.log(`✓ ${attemptLabel} ... complete`) // eslint-disable-line no-console
			break
		}

		if (isNoChecksReportedMessage(trimmedOutput)) {
			if (attempt < maxAttempts) {
				console.log('Status check results are not available yet. Retrying in a few seconds.') // eslint-disable-line no-console
				await waitFor(retryDelayMs)
				continue
			}

			console.log('Status check results were not available by the final attempt, continuing anyway.') // eslint-disable-line no-console
			console.log(`✓ ${attemptLabel} ... complete`) // eslint-disable-line no-console
			break
		}

		console.log(`✗ ${attemptLabel} ... failed`) // eslint-disable-line no-console
		throw new AutomationError(
			`Failed to fetch status check results.${trimmedOutput.length > 0 ? `\n${trimmedOutput}` : ''}`
		)
	}

	const sonarLine = trimmedOutput
		.split(/\r?\n/u)
		.find((line) => line.toLowerCase().includes('sonarcloud'))

	if (sonarLine !== undefined && !sonarLine.toLowerCase().includes('pass') && !sonarLine.toLowerCase().includes('success')) {
		const sonarUrlMatch = /https?:\/\/\S+/u.exec(sonarLine)
		const sonarUrl = sonarUrlMatch?.[0] ?? prInfo.url ?? ''
		throw new AutomationError(
			[
				'⚠️ SonarCloud reported issues.',
				`Details: ${sonarUrl}`,
				'Resolve the issues, then commit and push again.',
			].join(EOL)
		)
	}

	if (!hasLoggedOutput && trimmedOutput.length > 0 && !isNoChecksReportedMessage(trimmedOutput)) {
		console.log(trimmedOutput) // eslint-disable-line no-console
	}

	return prInfo
}

function summarizeOperations(config: AutomationConfig): string {
	const enabled = Object.entries(config.operations)
		.filter(([, value]) => value)
		.map(([key]) => key)
	return enabled.length > 0 ? enabled.join(', ') : 'none'
}

async function main(): Promise<void> {
	const prompt = process.stdin.isTTY ? createInterface({ input, output }) : undefined

	try {
		ensureStagingState()
		await ensurePackageJsonVersion(prompt)

		const issueLine = await readIssueLine(prompt)
		const config = parseAutomationConfig(issueLine)

		let currentBranch = getCurrentBranch()
		const isOnMain = currentBranch === 'main' || currentBranch === 'master'

		ensureBranchMatchesIssue(currentBranch, config.issueNumber)

		if (isOnMain) {
			ensureMainIsUpdated(currentBranch)

			if (currentBranch !== config.targetBranch) {
				createBranch(config.targetBranch)
				currentBranch = config.targetBranch
			}
		} else if (currentBranch !== config.targetBranch) {
			console.log(
				`⚠️ The current branch (${currentBranch}) differs from the recommended branch name (${config.targetBranch}). Continuing on the existing branch.`
			) // eslint-disable-line no-console
		}

		ensureIssueMatches(config)
		console.log('✓ Pre-flight checks complete') // eslint-disable-line no-console

		config.operations = await configureOperations(prompt)

		const summary = summarizeOperations(config)
		console.log(`\nStarting execution (Issue #${config.issueNumber}: ${config.issueTitle} → ${summary})`) // eslint-disable-line no-console

		if (config.operations.commit) {
			runCommit(config)
			console.log('✓ Commit complete') // eslint-disable-line no-console
		}

		if (config.operations.push) {
			runPush(currentBranch)
			console.log('✓ Push complete') // eslint-disable-line no-console
		}

		if (config.operations.pr) {
			createPullRequest(config)
			console.log('✓ PR creation complete') // eslint-disable-line no-console

			await watchPullRequestChecks(currentBranch)
			console.log('✓ Status checks complete') // eslint-disable-line no-console

			const prInfo = await evaluateSonarChecks(currentBranch)
			console.log('✓ SonarCloud verification complete') // eslint-disable-line no-console

			console.log('---') // eslint-disable-line no-console
			console.log('\n✅ All operations completed successfully') // eslint-disable-line no-console

			if (prInfo.url !== undefined) {
				console.log(`\nPR details:`) // eslint-disable-line no-console
				console.log(`- URL: ${prInfo.url}`) // eslint-disable-line no-console
			}

			if (prInfo.title !== undefined) {
				console.log(`- Title: ${prInfo.title}`) // eslint-disable-line no-console
			}

			console.log('- Status: ✓ All checks passed') // eslint-disable-line no-console
			console.log('\nNext step: request a code review.') // eslint-disable-line no-console

			return
		}

		console.log('---') // eslint-disable-line no-console
		console.log('✅ Requested operations completed') // eslint-disable-line no-console
	} catch (error) {
		if (error instanceof AutomationError) {
			console.error(error.message) // eslint-disable-line no-console
			exit(1)
		}

		if (error instanceof Error) {
			console.error(`An unexpected error occurred: ${error.message}`) // eslint-disable-line no-console
			exit(1)
		}

		console.error('An unexpected error occurred.') // eslint-disable-line no-console
		exit(1)
	} finally {
		await prompt?.close()
	}
}

await main()

