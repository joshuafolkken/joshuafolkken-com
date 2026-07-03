import { APP } from '$lib/app'
import { CONTENT_TYPE, HTTP_HEADERS } from '$lib/constants/http'

const CHAT_ENDPOINT = '/api/chat'
const SSE_DATA_PREFIX = 'data:'
const SSE_DONE = '[DONE]'
const NEWLINE = '\n'

interface AskOutcome {
	grounded: boolean
}

interface DeltaEnvelope {
	choices?: Array<{ delta?: { content?: unknown } }>
}

type TokenHandler = (text: string) => void

function get_delta_content(envelope: DeltaEnvelope): unknown {
	return envelope.choices?.[0]?.delta?.content
}

function extract_content(value: unknown): string | undefined {
	if (typeof value !== 'object' || value === null) return undefined

	const content = get_delta_content(value)

	return typeof content === 'string' ? content : undefined
}

function parse_delta(data: string): string | undefined {
	const trimmed = data.trim()

	if (trimmed.length === 0 || trimmed === SSE_DONE) return undefined

	try {
		const parsed: unknown = JSON.parse(trimmed)

		return extract_content(parsed)
	} catch {
		return undefined
	}
}

function handle_line(line: string, on_token: TokenHandler): void {
	if (!line.startsWith(SSE_DATA_PREFIX)) return

	const text = parse_delta(line.slice(SSE_DATA_PREFIX.length))

	if (text !== undefined) on_token(text)
}

function process_buffer(buffer: string, on_token: TokenHandler): string {
	const lines = buffer.split(NEWLINE)
	const remainder = lines.pop() ?? ''

	for (const line of lines) handle_line(line, on_token)

	return remainder
}

async function consume_stream(response: Response, on_token: TokenHandler): Promise<void> {
	const reader = response.body?.getReader()

	if (!reader) return

	const decoder = new TextDecoder()
	let buffer = ''
	let result = await reader.read()

	while (!result.done) {
		buffer = process_buffer(buffer + decoder.decode(result.value, { stream: true }), on_token)
		result = await reader.read()
	}

	// Flush any buffered multibyte tail, then handle a final line not terminated by a newline.
	handle_line(buffer + decoder.decode(), on_token)
}

async function ask(question: string, on_token: TokenHandler): Promise<AskOutcome> {
	const response = await fetch(CHAT_ENDPOINT, {
		method: 'POST',
		headers: {
			[HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
			[HTTP_HEADERS.X_APP_CLIENT]: APP.ID,
		},
		body: JSON.stringify({ question }),
	})

	if (!response.ok) throw new Error(`Chat request failed: ${String(response.status)}`)

	const content_type = response.headers.get(HTTP_HEADERS.CONTENT_TYPE) ?? ''

	if (content_type.includes(CONTENT_TYPE.JSON)) return { grounded: false }

	await consume_stream(response, on_token)

	return { grounded: true }
}

export const chat_api = {
	ask,
	parse_delta,
}
