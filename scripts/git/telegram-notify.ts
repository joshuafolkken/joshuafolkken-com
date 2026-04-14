const TELEGRAM_API_BASE = 'https://api.telegram.org'

interface TelegramSendInput {
	message: string
	issue_url: string | undefined
	pr_url: string | undefined
}

interface TelegramConfig {
	bot_token: string
	chat_id: string
}

function get_environment(name: string): string | undefined {
	return process.env[name]
}

function load_config(): TelegramConfig | undefined {
	const bot_token = get_environment('TELEGRAM_BOT_TOKEN')?.trim()
	const chat_id = get_environment('TELEGRAM_CHAT_ID')?.trim()

	if (!bot_token || !chat_id) return undefined

	return { bot_token, chat_id }
}

function append_if_present(parts: Array<string>, label: string, value: string | undefined): void {
	if (value !== undefined && value.length > 0) parts.push(`${label}: ${value}`)
}

function build_url_parts(input: TelegramSendInput): Array<string> {
	const parts: Array<string> = []

	append_if_present(parts, 'Issue', input.issue_url)
	append_if_present(parts, 'PR', input.pr_url)

	return parts
}

function build_text(input: TelegramSendInput): string {
	const [raw_title = '', ...bullets] = input.message.split('\n')
	const header = [`✅ ${raw_title}`, ...bullets].join('\n')
	const url_parts = build_url_parts(input)

	return [header, ...url_parts].join('\n\n')
}

async function post_message(config: TelegramConfig, text: string): Promise<void> {
	const url = `${TELEGRAM_API_BASE}/bot${config.bot_token}/sendMessage`
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: config.chat_id, text }),
	})

	if (!response.ok) {
		throw new Error(`Telegram API error: ${String(response.status)} ${response.statusText}`)
	}
}

const SKIP_WARNING =
	'⚠️  Telegram not configured: TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHAT_ID not set. Skipping.'

async function send(input: TelegramSendInput): Promise<void> {
	const config = load_config()

	if (config === undefined) {
		console.warn(SKIP_WARNING)

		return
	}

	const text = build_text(input)

	try {
		await post_message(config, text)
		console.info('📱 Telegram notification sent.')
	} catch (error) {
		console.warn(
			'⚠️  Telegram notification failed:',
			error instanceof Error ? error.message : error,
		)
	}
}

const telegram_notify = {
	send,
}

export { telegram_notify, build_text }
export type { TelegramSendInput }
