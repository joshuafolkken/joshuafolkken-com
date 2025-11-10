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
		throw new AutomationError('対話的入力が必要です。TTY環境で再実行してください。')
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
			throw new AutomationError('入力が不足しています。Issue情報を含む行を提供してください。')
		}

		return lines[0] ?? ''
	}

	const rl = ensurePromptInterface(prompt)
	const issueLine = await rl.question('Issue情報 (<title> #<number>): ')

	return issueLine.trim()
}

function parseIssueLine(line: string): { issueTitle: string; issueNumber: string } {
	const normalized = line.replace(/^issue:\s*/iu, '').trim()
	const hashIndex = normalized.lastIndexOf('#')

	if (hashIndex <= 0) {
		throw new AutomationError('Issue情報の形式が不正です。`<title> #<number>` の形式で指定してください。')
	}

	const rawTitle = normalized.slice(0, hashIndex).trim()
	const rawNumber = normalized.slice(hashIndex + 1).trim()
	const numberMatch = rawNumber.match(/\d+/u)

	if (rawTitle.length === 0 || numberMatch === null) {
		throw new AutomationError('Issue情報の形式が不正です。タイトルまたは番号を確認してください。')
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
	const { stdio = 'pipe', allowNonZeroExit = false, env, description } = options
	const startMessage = description !== undefined ? `▶ ${description} 実行します...` : undefined
	const inlineStatus = startMessage !== undefined && stdio === 'pipe'
	if (startMessage !== undefined) {
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
			description !== undefined ? `${description} に失敗しました: ${result.error.message}` : result.error.message,
			{ cause: result.error }
		)
	}

	const status = result.status ?? 0
	const stdout = typeof result.stdout === 'string' ? result.stdout : ''
	const stderr = typeof result.stderr === 'string' ? result.stderr : ''

	if (!allowNonZeroExit && status !== 0) {
		const message =
			description !== undefined
				? `${description} に失敗しました。${stderr.trim().length > 0 ? `\n${stderr.trim()}` : ''}`
				: `コマンド実行に失敗しました: ${command} ${args.join(' ')}`
		if (description !== undefined) {
			const failMessage = `✗ ${description} 実行します... 失敗`
			if (inlineStatus) {
				const padding = startMessage.length > failMessage.length ? ' '.repeat(startMessage.length - failMessage.length) : ''
				process.stdout.write(`\r${failMessage}${padding}\n`)
			} else {
				console.error(failMessage) // eslint-disable-line no-console
			}
		}
		throw new AutomationError(message)
	}

	if (description !== undefined && (allowNonZeroExit || status === 0)) {
		const successMessage = `✓ ${description} 実行します... 完了`
		if (inlineStatus) {
			const padding = startMessage.length > successMessage.length ? ' '.repeat(startMessage.length - successMessage.length) : ''
			process.stdout.write(`\r${successMessage}${padding}\n`)
		} else {
			console.log(successMessage) // eslint-disable-line no-console
		}
	}

	return { stdout, stderr, status }
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
			`⚠️ ${command} がインストールされていません。必要に応じてインストールしてから再実行してください。`
		)
	}
}

function ensureStagingState(): void {
	const { stdout } = runCommand('git', ['status', '--porcelain'], { description: 'ステージング状態の確認' })

	const lines = stdout
		.split(/\r?\n/u)
		.map((line) => line.replace(/\s+$/u, ''))
		.filter((line) => line.length > 0)

	const hasUntracked = lines.some((line) => line.startsWith('??'))
	const hasUnstaged = lines.some((line) => line.length >= 2 && line[1] !== ' ')

	if (hasUntracked || hasUnstaged) {
		throw new AutomationError(
			[
				'🚫 すべての変更ファイルがステージングされていません。',
				'以下のコマンドでステージングしてください：',
				'  git add .',
				'ステージング後に再度実行してください。',
			].join(EOL)
		)
	}
}

function getCurrentBranch(): string {
	const { stdout } = runCommand('git', ['branch', '--show-current'], {
		description: '現在のブランチ取得',
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
				'🚫 Issue番号とブランチ番号が一致しません。',
				`  指定されたIssue番号: #${issueNumber}`,
				`  現在のブランチ:       ${branch}`,
				'正しいブランチに切り替えるか、新しいブランチを作成してから再実行してください。',
			].join(EOL)
		)
	}
}

function ensureMainIsUpdated(branch: string): void {
	const target = branch === 'master' ? 'master' : 'main'
	runCommand('git', ['pull', 'origin', target], {
		stdio: 'inherit',
		description: `${target} ブランチの最新取得`,
	})
}

function checkoutBranch(branch: string): void {
	runCommand('git', ['checkout', branch], {
		stdio: 'inherit',
		description: `${branch} ブランチへの切り替え`,
	})
}

function createBranch(branch: string): void {
	runCommand('git', ['checkout', '-b', branch], {
		stdio: 'inherit',
		description: `${branch} ブランチの作成`,
	})
}

function ensureIssueMatches(config: AutomationConfig): void {
	ensureCommandExists('gh')

	const { stdout } = runCommand(
		'gh',
		['issue', 'view', config.issueNumber, '--json', 'title', '--jq', '.title'],
		{
			description: 'Issue情報の検証',
		}
	)

	const githubTitle = stdout.trim()
	if (githubTitle.length === 0) {
		throw new AutomationError(`🚫 Issue #${config.issueNumber} が見つかりません。`)
	}

	if (githubTitle !== config.issueTitle) {
		throw new AutomationError(
			[
				'🚫 Issueタイトルが一致しません。',
				`  指定されたタイトル: ${config.issueTitle}`,
				`  GitHubのタイトル:    ${githubTitle}`,
				'Issue番号とタイトルを確認してください。',
			].join(EOL)
		)
	}
}

function getStagedFiles(): string[] {
	const { stdout } = runCommand('git', ['diff', '--cached', '--name-only'], {
		description: 'ステージ済みファイルの取得',
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
			'⚠️ package.json がステージング済みの変更に含まれていません。続行しますか？ (y/n): '
		)
		if (!shouldContinue) {
			throw new AutomationError('ユーザーが続行をキャンセルしました。')
		}
		return
	}

	const diff = runCommand('git', ['diff', '--cached', 'package.json'], {
		description: 'package.json の差分確認',
	}).stdout

	const versionChanged = /^[+-]\s*"version"\s*:/gmu.test(diff)

	if (!versionChanged) {
		const shouldContinue = await askYesNoBinary(
			rl,
			'⚠️ package.json の version が更新されていません。続行しますか？ (y/n): '
		)
		if (!shouldContinue) {
			throw new AutomationError('ユーザーが続行をキャンセルしました。')
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

	console.log('y か n で回答してください。') // eslint-disable-line no-console
	return askYesNoBinary(prompt, question)
}

async function configureOperations(prompt: Interface | undefined): Promise<Record<Operation, boolean>> {
	const rl = ensurePromptInterface(prompt)

	while (true) {
		const commit = await askYesNoBinary(rl, 'コミットを実行しますか？ (y/n): ')
		const push = await askYesNoBinary(rl, 'プッシュを実行しますか？ (y/n): ')
		const pr = await askYesNoBinary(rl, 'PR作成を実行しますか？ (y/n): ')

		console.log('現在の設定:') // eslint-disable-line no-console
		console.log(`- コミット: ${commit ? '実行する' : '実行しない'}`) // eslint-disable-line no-console
		console.log(`- プッシュ: ${push ? '実行する' : '実行しない'}`) // eslint-disable-line no-console
		console.log(`- PR作成: ${pr ? '実行する' : '実行しない'}`) // eslint-disable-line no-console

		const confirm = await askYesNoBinary(rl, 'この設定で進めますか？ (y/n): ')
		if (confirm) {
			return { commit, push, pr }
		}

		console.log('設定を再入力します。') // eslint-disable-line no-console
	}
}

function runCommit(config: AutomationConfig): void {
	const commitMessage = `${config.issueTitle} #${config.issueNumber}`
	runCommand('git', ['commit', '-m', commitMessage], {
		stdio: 'inherit',
		description: 'コミット',
	})
}

function runPush(branch: string): void {
	runCommand('git', ['push', '-u', 'origin', branch], {
		stdio: 'inherit',
		description: 'プッシュ',
	})
}

function createPullRequest(config: AutomationConfig): void {
	const title = `${config.issueTitle} #${config.issueNumber}`
	const body = `closes #${config.issueNumber}`
	const description = 'PR作成'

	console.log(`▶ ${description} 実行します...`) // eslint-disable-line no-console

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
		console.log(`✓ ${description} 実行します... 完了`) // eslint-disable-line no-console
		return
	}

	if (isExistingPullRequestMessage(output)) {
		console.log('既存のPRが見つかりました。同じPRを利用して処理を継続します。') // eslint-disable-line no-console
		console.log(`✓ ${description} 実行します... 完了`) // eslint-disable-line no-console
		return
	}

	console.log(`✗ ${description} 実行します... 失敗`) // eslint-disable-line no-console

	throw new AutomationError(`PR作成に失敗しました。${output.length > 0 ? `\n${output.trim()}` : ''}`)
}

function watchPullRequestChecks(branch: string): void {
	const description = 'ステータスチェック待機'
	console.log(`▶ ${description} 実行します...`) // eslint-disable-line no-console

	const result = runCommand('gh', ['pr', 'checks', '--watch', branch], {
		stdio: 'pipe',
		allowNonZeroExit: true,
	})

	const output = [result.stdout, result.stderr].filter((value) => value !== undefined && value.trim().length > 0).join('\n')
	const trimmedOutput = output.trim()

	if (result.status === 0 || isNoChecksReportedMessage(trimmedOutput)) {
		if (trimmedOutput.length > 0 && !isNoChecksReportedMessage(trimmedOutput)) {
			console.log(trimmedOutput) // eslint-disable-line no-console
		} else if (isNoChecksReportedMessage(trimmedOutput)) {
			console.log('ステータスチェックがまだ登録されていませんが、処理を継続します。') // eslint-disable-line no-console
		}
		console.log(`✓ ${description} 実行します... 完了`) // eslint-disable-line no-console
		return
	}

	console.log(`✗ ${description} 実行します... 失敗`) // eslint-disable-line no-console

	throw new AutomationError(`ステータスチェック待機に失敗しました。${trimmedOutput.length > 0 ? `\n${trimmedOutput}` : ''}`)
}

function evaluateSonarChecks(branch: string): { url?: string; title?: string } {
	const { stdout } = runCommand('gh', ['pr', 'view', branch, '--json', 'url,title,number'], {
		description: 'PR情報の取得',
	})

	let prInfo: { url?: string; title?: string } = {}
	try {
		prInfo = JSON.parse(stdout) as { url?: string; title?: string }
	} catch (error) {
		throw new AutomationError('PR情報の取得に失敗しました。JSONの解析に失敗しました。', { cause: error })
	}

	const checksResult = runCommand('gh', ['pr', 'checks', branch], {
		stdio: 'pipe',
		allowNonZeroExit: true,
		description: 'ステータスチェック結果の取得',
	})

	const output = [checksResult.stdout, checksResult.stderr]
		.filter((value) => value !== undefined && value.trim().length > 0)
		.join('\n')
	const trimmedOutput = output.trim()

	if (checksResult.status !== 0 && trimmedOutput.length > 0 && !isNoChecksReportedMessage(trimmedOutput)) {
		throw new AutomationError(`ステータスチェック結果の取得に失敗しました。\n${trimmedOutput}`)
}

	const sonarLine = trimmedOutput
		.split(/\r?\n/u)
		.find((line) => line.toLowerCase().includes('sonarcloud'))

	if (sonarLine !== undefined && !sonarLine.toLowerCase().includes('pass') && !sonarLine.toLowerCase().includes('success')) {
		const sonarUrlMatch = /https?:\/\/\S+/u.exec(sonarLine)
		const sonarUrl = sonarUrlMatch?.[0] ?? prInfo.url ?? ''
		throw new AutomationError(
			[
				'⚠️ SonarCloud で問題が検出されました。',
				`詳細: ${sonarUrl}`,
				'問題を修正した後、再度コミットおよびプッシュしてください。',
			].join(EOL)
		)
	}

	if (trimmedOutput.length > 0) {
		console.log(trimmedOutput) // eslint-disable-line no-console
	}

	return prInfo
}

function summarizeOperations(config: AutomationConfig): string {
	const enabled = Object.entries(config.operations)
		.filter(([, value]) => value)
		.map(([key]) => key)
	return enabled.length > 0 ? enabled.join(', ') : 'なし'
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
				`⚠️ 現在のブランチ (${currentBranch}) と推奨ブランチ名 (${config.targetBranch}) が異なります。既存ブランチで処理を続行します。`
			) // eslint-disable-line no-console
		}

		ensureIssueMatches(config)
		console.log('✓ 事前チェック完了') // eslint-disable-line no-console

		config.operations = await configureOperations(prompt)

		const summary = summarizeOperations(config)
		console.log(`処理を開始します（Issue #${config.issueNumber}: ${config.issueTitle} → ${summary}）`) // eslint-disable-line no-console

		if (config.operations.commit) {
			runCommit(config)
			console.log('✓ コミット完了') // eslint-disable-line no-console
		}

		if (config.operations.push) {
			runPush(currentBranch)
			console.log('✓ プッシュ完了') // eslint-disable-line no-console
		}

		if (config.operations.pr) {
			createPullRequest(config)
			console.log('✓ PR作成完了') // eslint-disable-line no-console

			watchPullRequestChecks(currentBranch)
			console.log('✓ ステータスチェック完了') // eslint-disable-line no-console

			const prInfo = evaluateSonarChecks(currentBranch)
			console.log('✓ SonarCloud確認完了') // eslint-disable-line no-console

			console.log('---') // eslint-disable-line no-console
			console.log('✅ すべての処理が正常に完了しました') // eslint-disable-line no-console

			if (prInfo.url !== undefined) {
				console.log(`PR情報:`) // eslint-disable-line no-console
				console.log(`- URL: ${prInfo.url}`) // eslint-disable-line no-console
			}

			if (prInfo.title !== undefined) {
				console.log(`- タイトル: ${prInfo.title}`) // eslint-disable-line no-console
			}

			console.log('- ステータス: ✓ All checks passed') // eslint-disable-line no-console
			if (prInfo.url !== undefined) {
				console.log(`次のステップ: コードレビューを依頼してください（PR: ${prInfo.url}）。`) // eslint-disable-line no-console
			} else {
				console.log('次のステップ: コードレビューを依頼してください。') // eslint-disable-line no-console
			}

			return
		}

		console.log('---') // eslint-disable-line no-console
		console.log('✅ 指定された処理が完了しました') // eslint-disable-line no-console
	} catch (error) {
		if (error instanceof AutomationError) {
			console.error(error.message) // eslint-disable-line no-console
			exit(1)
		}

		if (error instanceof Error) {
			console.error(`予期しないエラーが発生しました: ${error.message}`) // eslint-disable-line no-console
			exit(1)
		}

		console.error('予期しないエラーが発生しました。') // eslint-disable-line no-console
		exit(1)
	} finally {
		await prompt?.close()
	}
}

await main()

