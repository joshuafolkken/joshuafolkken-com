<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { chat_api } from '$lib/api/chat-api'
	import { APP, AUTHOR } from '$lib/app'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import { CHAT_LABELS } from '$lib/constants/chat'
	import { chat_state } from '$lib/hooks/ChatState.svelte'
	import ArrowUpIcon from '$lib/icons/ArrowUpIcon.svelte'
	import { markdown } from '$lib/utils/markdown'

	const PAGE_TITLE = `${CHAT_LABELS.TITLE} - ${AUTHOR.NAME}`

	const USER_BUBBLE_CLASS = 'max-w-[85%] self-end rounded-lg bg-sky-600/80 px-4 py-2 text-white'
	const ASSISTANT_BUBBLE_CLASS =
		'max-w-[85%] self-start rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-white/90'
	const TEXT_CLASS = 'break-words whitespace-pre-wrap'
	const MARKDOWN_CLASS = 'markdown break-words'
	const DOT_CLASS = 'size-1.5 animate-thinking rounded-full bg-white/70'

	let input = $state('')
	let is_loading = $state(false)
	let input_el = $state<HTMLInputElement>()

	let has_rendered_once = false

	$effect(() => {
		input_el?.focus({ preventScroll: true })
	})

	afterNavigate(() => {
		// The page scrolls smoothly by default (html { scroll-behavior: smooth }); on display, force an
		// instant jump so a returning visitor opens at the bottom of their restored history rather than
		// watching it animate down from the top. afterNavigate runs after SvelteKit resets scroll on a
		// client-side navigation, so the jump also survives arriving here from another page (not just reload).
		if (chat_state.get_messages().length > 0) {
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
		}
	})

	$effect(() => {
		// Deep-read every message's text so a streamed reply re-triggers this effect; the read must
		// stay first so the dependency is registered even on the initial (skipped) run.
		const content = chat_state
			.get_messages()
			.map((message) => message.text)
			.join('')

		// afterNavigate positions the initial view; only follow later streamed replies here, and smoothly,
		// so the page load itself is never animated.
		if (has_rendered_once && content) {
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
		}

		has_rendered_once = true
	})

	async function respond(question: string, index: number): Promise<void> {
		try {
			await chat_api.ask(question, (token) => {
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

	async function send(): Promise<void> {
		const question = input.trim()

		if (is_busy(question)) return

		input = ''

		if (question === CHAT_LABELS.CLEAR_COMMAND) {
			chat_state.reset()

			return
		}

		is_loading = true
		const index = chat_state.start_exchange(question)

		await respond(question, index)

		is_loading = false
	}

	function handle_submit(event: SubmitEvent): void {
		event.preventDefault()
		void send()
	}
</script>

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
						<div class={USER_BUBBLE_CLASS}>
							<p class={TEXT_CLASS}>{message.text}</p>
						</div>
					{:else}
						<div class={ASSISTANT_BUBBLE_CLASS}>
							{#if message.text}
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<div class={MARKDOWN_CLASS}>{@html markdown.to_html(message.text)}</div>
							{:else}
								<span class="inline-flex gap-1 py-1" aria-label={CHAT_LABELS.THINKING}>
									<span class={`${DOT_CLASS} [animation-delay:-0.3s]`}></span>
									<span class={`${DOT_CLASS} [animation-delay:-0.15s]`}></span>
									<span class={DOT_CLASS}></span>
								</span>
							{/if}
						</div>
					{/if}
				{/each}
			{/if}
		</div>

		<form class="sticky bottom-0 flex gap-2 bg-slate-950 pt-3 pb-4" onsubmit={handle_submit}>
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
