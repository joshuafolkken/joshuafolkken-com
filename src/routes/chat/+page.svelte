<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { chat_api } from '$lib/api/chat-api'
	import { chat_history } from '$lib/api/chat-history'
	import { APP, AUTHOR } from '$lib/app'
	import ChatTimestamp from '$lib/components/ChatTimestamp.svelte'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import { CHAT_LABELS } from '$lib/constants/chat'
	import { chat_state } from '$lib/hooks/ChatState.svelte'
	import ArrowDownIcon from '$lib/icons/ArrowDownIcon.svelte'
	import ArrowUpIcon from '$lib/icons/ArrowUpIcon.svelte'
	import { markdown } from '$lib/utils/markdown'
	import { scheduling } from '$lib/utils/scheduling'
	import { fade } from 'svelte/transition'

	const PAGE_TITLE = `${CHAT_LABELS.TITLE} - ${AUTHOR.NAME}`

	// Sentinel for "no reply is streaming": the streaming message renders as plain text (see the each
	// block), every settled message as Markdown.
	const NO_STREAM_INDEX = -1

	// Treat anything within this many pixels of the bottom as "at the bottom" so sub-pixel rounding
	// and the smooth-scroll tail don't leave the button lingering once the newest message is in view.
	const SCROLL_BOTTOM_THRESHOLD = 24
	// Fade the scroll-to-bottom button in and out rather than popping it on/off.
	const SCROLL_FADE_MS = 200

	const USER_BUBBLE_CLASS = 'max-w-[85%] self-end rounded-lg bg-sky-600/80 px-4 py-2 text-white'
	const ASSISTANT_MESSAGE_CLASS = 'text-white/90'
	const TEXT_CLASS = 'break-words whitespace-pre-wrap'
	const MARKDOWN_CLASS = 'markdown break-words'
	const DOT_CLASS = 'size-1.5 animate-thinking rounded-full bg-white/70'
	const SCROLL_BUTTON_CLASS =
		'absolute -top-14 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-800/90 text-white/70 shadow-lg backdrop-blur transition hover:bg-slate-700 hover:text-white'

	let input = $state('')
	let is_loading = $state(false)
	let input_el = $state<HTMLInputElement>()
	let is_at_bottom = $state(true)
	let streaming_index = $state(NO_STREAM_INDEX)
	// Parsed HTML of the reply that is currently streaming. Re-parsing the growing Markdown per token is
	// O(n^2), so parse_streaming below throttles it to one parse per frame instead.
	let streaming_html = $state('')

	let has_rendered_once = false
	// Tracks the previous streaming state so the plain -> Markdown flip can trigger a follow-scroll.
	let did_stream = false
	// False until the streaming reply has been parsed once this exchange, so the first token is parsed
	// synchronously (no blank frame) while every later token is throttled to one parse per frame.
	let did_parse_stream = false
	// Distance in px from the bottom of the page, cached on every scroll so a viewport resize (software
	// keyboard) can restore it and keep the same content in view rather than letting the keyboard cover it.
	let bottom_distance = 0

	$effect(() => {
		input_el?.focus({ preventScroll: true })
	})

	function scroll_to_bottom(): void {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
	}

	// Following a streamed reply fires once per token; throttle to one instant jump per frame so a fast
	// stream can't restart a smooth animation on every token (which fights itself and stutters).
	const follow_bottom = scheduling.raf_throttle(() => {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
	})

	function render_streaming(): void {
		streaming_html = markdown.to_html(chat_state.get_messages()[streaming_index]?.text ?? '')
	}

	// Re-parse the streaming reply at most once per frame: a fast token stream schedules this many times,
	// but marked/DOMPurify run only on the next frame, keeping the parse count off the token count.
	const parse_streaming = scheduling.raf_throttle(render_streaming)

	function sync_is_at_bottom(): void {
		bottom_distance = document.documentElement.scrollHeight - window.innerHeight - window.scrollY

		is_at_bottom = bottom_distance <= SCROLL_BOTTOM_THRESHOLD
	}

	function pin_to_bottom(): void {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
		is_at_bottom = true
		bottom_distance = 0
	}

	function handle_resize(): void {
		// A software keyboard opening (Android's interactive-widget=resizes-content, or iOS via the
		// visualViewport resize below) shrinks the viewport from the bottom, so without adjusting, the
		// content the user was viewing is hidden behind the keyboard. Keep the bottom edge of the viewport
		// fixed by restoring the distance from the bottom captured on the last scroll: an at-bottom view
		// stays pinned to the newest message, and a mid-scroll view keeps its content in place above the
		// input, while a user scrolled up to read history is not yanked down to the bottom.
		const max_top = document.documentElement.scrollHeight - window.innerHeight

		window.scrollTo({ top: Math.max(0, max_top - bottom_distance), behavior: 'instant' })

		sync_is_at_bottom()
	}

	$effect(() => {
		// <svelte:window> only exposes the layout-viewport resize; iOS Safari shrinks the visual viewport
		// for the keyboard without firing that, so listen to visualViewport directly as well.
		const viewport = window.visualViewport

		viewport?.addEventListener('resize', handle_resize)

		return () => {
			viewport?.removeEventListener('resize', handle_resize)
		}
	})

	afterNavigate(() => {
		// The page scrolls smoothly by default (html { scroll-behavior: smooth }); on display, force an
		// instant jump so a returning visitor opens at the bottom of their restored history rather than
		// watching it animate down from the top. afterNavigate runs after SvelteKit resets scroll on a
		// client-side navigation, so the jump also survives arriving here from another page (not just reload).
		if (chat_state.get_messages().length > 0) {
			pin_to_bottom()
		}
	})

	$effect(() => {
		// Sum every message's text length so a streamed token re-triggers this effect; this is a cheap
		// dependency read (string lengths, no concatenation) and must stay first so the dependency is
		// registered even on the initial (skipped) run.
		const streamed_chars = chat_state
			.get_messages()
			.reduce((total, message) => total + message.text.length, 0)

		// afterNavigate positions the initial view; only follow later streamed replies here, throttled to
		// one jump per frame.
		if (has_rendered_once && streamed_chars > 0) {
			follow_bottom.schedule()
			// The follow lands at the bottom, so hide the button now rather than letting it flash visible
			// until the settling scroll events would clear it.
			is_at_bottom = true
		}

		has_rendered_once = true
	})

	$effect(() => {
		// When a reply finishes streaming it re-renders from plain text to Markdown, which changes the
		// rendered height without changing text length (so the length-based effect above does not fire).
		// Follow the reader to the new bottom on that plain -> Markdown flip.
		const is_streaming = streaming_index !== NO_STREAM_INDEX

		if (did_stream && !is_streaming) follow_bottom.schedule()

		did_stream = is_streaming
	})

	$effect(() => {
		// Reading the streaming reply's text length registers a dependency so each appended token re-runs
		// this effect; when nothing streams there is no dependency.
		if (streaming_index === NO_STREAM_INDEX) return

		const streaming_message = chat_state.get_messages()[streaming_index]

		if (!streaming_message || streaming_message.text.length === 0) return

		// Parse the first token synchronously (flushes before paint, so no blank frame between the dots
		// turning off and the first parse); throttle every later token to one parse per frame.
		if (did_parse_stream) parse_streaming.schedule()
		else render_streaming()

		did_parse_stream = true
	})

	async function respond(index: number): Promise<void> {
		// The window is read after start_exchange, so it already includes this turn's question and
		// excludes the empty assistant placeholder that build_request_messages filters out.
		const messages = chat_history.build_request_messages(chat_state.get_messages())

		try {
			await chat_api.ask(messages, (token) => {
				chat_state.append(index, token)
			})

			// Covers both not-grounded (no stream) and a grounded stream that yielded no tokens.
			chat_state.set_if_empty(index, CHAT_LABELS.NOT_FOUND)
		} catch {
			chat_state.set(index, CHAT_LABELS.ERROR)
		}
	}

	function is_busy(question: string): boolean {
		return question.length === 0 || is_loading
	}

	async function run_exchange(question: string): Promise<void> {
		is_loading = true
		const index = chat_state.start_exchange(question)

		// Drop the previous reply's parsed HTML so its formatted body cannot flash in this new bubble
		// before the first token of this reply is parsed.
		streaming_html = ''
		did_parse_stream = false
		streaming_index = index

		try {
			await respond(index)
		} finally {
			// Clearing the index flips the reply from plain streaming text to parsed Markdown.
			streaming_index = NO_STREAM_INDEX
			is_loading = false
		}
	}

	async function send(): Promise<void> {
		const question = input.trim()

		if (is_busy(question)) return

		input = ''

		if (question === CHAT_LABELS.CLEAR_COMMAND) {
			chat_state.reset()

			return
		}

		await run_exchange(question)
	}

	function handle_submit(event: SubmitEvent): void {
		event.preventDefault()
		void send()
	}
</script>

<svelte:window onscroll={sync_is_at_bottom} onresize={handle_resize} />

<svelte:head>
	<title>{PAGE_TITLE}</title>
	<meta name="description" content={CHAT_LABELS.DESCRIPTION} />
</svelte:head>

<MetaTags title={PAGE_TITLE} description={CHAT_LABELS.DESCRIPTION} url="{APP.URL}/chat" />

<PageLayout has_footer={false}>
	<div class="-mt-4 flex min-h-[calc(100dvh-5rem)] flex-col">
		<div class="flex flex-1 flex-col gap-3" data-testid="chat-messages">
			{#if chat_state.get_messages().length === 0}
				<div class="flex flex-1 items-center justify-center">
					<p class="text-2xl text-white/90" data-testid="chat-empty">
						{CHAT_LABELS.EMPTY_GREETING}
					</p>
				</div>
			{:else}
				{#each chat_state.get_messages() as message, index (index)}
					{#if message.role === 'user'}
						<div class={USER_BUBBLE_CLASS} data-testid="chat-message-user">
							<p class={TEXT_CLASS}>{message.text}</p>
						</div>
					{:else}
						<div class={ASSISTANT_MESSAGE_CLASS} data-testid="chat-message-assistant">
							{#if !message.text}
								<span class="inline-flex gap-1 py-1" aria-label={CHAT_LABELS.THINKING}>
									<span class={`${DOT_CLASS} [animation-delay:-0.3s]`}></span>
									<span class={`${DOT_CLASS} [animation-delay:-0.15s]`}></span>
									<span class={DOT_CLASS}></span>
								</span>
							{:else if index === streaming_index}
								<!-- Live-formatted while streaming; parse_streaming throttles the Markdown parse
								to one run per frame so the growing text is not re-parsed per token (O(n^2)). -->
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<div class={MARKDOWN_CLASS}>{@html streaming_html}</div>
							{:else}
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<div class={MARKDOWN_CLASS}>{@html markdown.to_html(message.text)}</div>
								{#if message.timestamp}
									<ChatTimestamp iso={message.timestamp} />
								{/if}
							{/if}
						</div>
					{/if}
				{/each}
			{/if}
		</div>

		<form class="sticky bottom-0 flex gap-2 bg-slate-950 pt-3 pb-4" onsubmit={handle_submit}>
			{#if !is_at_bottom && chat_state.get_messages().length > 0}
				<button
					type="button"
					onclick={scroll_to_bottom}
					transition:fade={{ duration: SCROLL_FADE_MS }}
					aria-label={CHAT_LABELS.SCROLL_TO_BOTTOM}
					data-testid="chat-scroll-bottom"
					class={SCROLL_BUTTON_CLASS}
				>
					<ArrowDownIcon />
				</button>
			{/if}
			<input
				bind:value={input}
				bind:this={input_el}
				type="text"
				aria-label={CHAT_LABELS.ASK}
				placeholder={CHAT_LABELS.PLACEHOLDER}
				data-testid="chat-input"
				class="flex-1 rounded-lg border border-white/10 bg-slate-800/30 px-4 py-2 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
			/>
			<button
				type="submit"
				disabled={is_loading}
				aria-label={CHAT_LABELS.SEND}
				data-testid="chat-send"
				class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white transition hover:bg-sky-500 disabled:opacity-50"
			>
				<ArrowUpIcon />
			</button>
		</form>
	</div>
</PageLayout>

<style>
	/* {@html} markdown content is not scoped by Svelte, so target descendants with :global. */
	.markdown :global(p) {
		margin: 0;
	}

	.markdown :global(p + p),
	.markdown :global(ul),
	.markdown :global(ol) {
		margin-top: 0.5rem;
	}

	.markdown :global(code) {
		border-radius: 0.25rem;
		background: rgb(255 255 255 / 0.12);
		padding: 0.1em 0.35em;
		font-size: 0.9em;
	}

	.markdown :global(pre) {
		overflow-x: auto;
		border-radius: 0.375rem;
		background: rgb(255 255 255 / 0.08);
		padding: 0.6rem 0.75rem;
	}

	.markdown :global(pre code) {
		background: transparent;
		padding: 0;
	}

	.markdown :global(a) {
		color: rgb(125 211 252);
		text-decoration: underline;
		word-break: break-all;
	}

	.markdown :global(a:hover) {
		color: rgb(186 230 253);
	}

	.markdown :global(strong) {
		font-weight: 700;
	}

	.markdown :global(ul),
	.markdown :global(ol) {
		padding-left: 1.25rem;
	}

	.markdown :global(ul) {
		list-style: disc;
	}

	.markdown :global(ol) {
		list-style: decimal;
	}

	.markdown :global(li) {
		margin: 0.125rem 0;
	}

	.markdown :global(h1),
	.markdown :global(h2),
	.markdown :global(h3) {
		margin: 0.5rem 0 0.25rem;
		font-weight: 700;
	}
</style>
