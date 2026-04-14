#!/usr/bin/env node
/**
 * Opens Chrome (Playwright) with automation defaults stripped so Google OAuth is more likely to work,
 * then saves storage state to e2e/.auth/user.json after you press Enter.
 */
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import { createInterface, type Interface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { chromium, type BrowserContext, type Page } from 'playwright'

const script_file_path = fileURLToPath(import.meta.url)
const repository_root = path.resolve(path.dirname(script_file_path), '..')
const auth_directory = path.join(repository_root, 'e2e', '.auth')
const chrome_profile_directory = path.join(auth_directory, 'chrome-profile')
const storage_state_path = path.join(auth_directory, 'user.json')

const default_app_url = 'http://localhost:5173'
const script_arguments_start_index = 2

function resolve_app_url(): string {
	const custom_url = process.argv.slice(script_arguments_start_index).at(0)

	return custom_url ?? default_app_url
}

function mkdir_chrome_profile(): void {
	mkdirSync(chrome_profile_directory, { recursive: true })
}

function print_instructions(): void {
	console.info('')
	console.info('ブラウザで Google ログインし、必要なら /dash まで進めてください。')
	console.info('終わったらこのターミナルで Enter を押すと、認証状態を保存します。')
	console.info(`保存先: ${storage_state_path}`)
	console.info('')
}

async function open_chrome_context(): Promise<BrowserContext> {
	return await chromium.launchPersistentContext(chrome_profile_directory, {
		channel: 'chrome',
		headless: false,
		viewport: { width: 1280, height: 720 },
		ignoreDefaultArgs: ['--enable-automation'],
		args: ['--disable-blink-features=AutomationControlled'],
	})
}

async function first_page_or_new(context: BrowserContext): Promise<Page> {
	const [existing] = context.pages()

	if (existing) return existing

	return await context.newPage()
}

async function save_after_user_confirms(
	context: BrowserContext,
	page: Page,
	readline: Interface,
	app_url: string,
): Promise<void> {
	await page.goto(app_url)
	print_instructions()
	await readline.question('Press Enter to save storage state and close the browser… ')
	await context.storageState({ path: storage_state_path })
	console.info(`Saved: ${storage_state_path}`)
}

async function main(): Promise<void> {
	mkdir_chrome_profile()
	const readline = createInterface({ input, output })
	const context = await open_chrome_context()
	const page = await first_page_or_new(context)

	try {
		await save_after_user_confirms(context, page, readline, resolve_app_url())
	} finally {
		readline.close()
		await context.close()
	}
}

try {
	await main()
} catch (error: unknown) {
	console.error(error)
	process.exit(1)
}
