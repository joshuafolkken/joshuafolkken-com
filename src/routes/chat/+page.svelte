<script lang="ts">
	import { chat_api } from '$lib/api/chat-api'
	import { APP, AUTHOR } from '$lib/app'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import { CHAT_LABELS } from '$lib/constants/chat'
	import { SECTION_HEADING_LIGHT_SM_CLASS } from '$lib/constants/typography'
	import { chat_state } from '$lib/hooks/ChatState.svelte'
	import { linkify } from '$lib/utils/linkify'

	const PAGE_TITLE = `${CHAT_LABELS.TITLE} - ${AUTHOR.NAME}`

	const USER_BUBBLE_CLASS = 'max-w-[85%] self-end rounded-lg bg-sky-600/80 px-4 py-2 text-white'
	const ASSISTANT_BUBBLE_CLASS =
		'max-w-[85%] self-start rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2 text-white/90'
	const TEXT_CLASS = 'break-words whitespace-pre-wrap'
	const LINK_CLASS = 'break-all text-sky-300 underline hover:text-sky-200'
	const DOT_CLASS = 'size-1.5 animate-thinking rounded-full bg-white/70'

	let input = $state('')
	let is_loading = $state(false)
	let messages_el = $state<HTMLDivElement>()
	let input_el = $state<HTMLInputElement>()

	$effect(() => {
		input_el?.focus({ preventScroll: true })
	})

	$effect(() => {
		const content = chat_state
			.get_messages()
			.map((message) => message.text)
			.join('')
		const element = messages_el

		if (element) {
			element.scrollTo({ top: element.scrollHeight, behavior: content ? 'smooth' : 'auto' })
		}
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

<PageLayout>
	<div class="-mt-4 flex h-[calc(100dvh-6rem)] flex-col desktop:mt-0 desktop:h-[70vh]">
		<div class="mb-3 shrink-0">
			<h1 class={SECTION_HEADING_LIGHT_SM_CLASS}>{CHAT_LABELS.TITLE}</h1>
			<p class="mt-1 text-sm text-white/70">{CHAT_LABELS.DESCRIPTION}</p>
		</div>

		<div
			bind:this={messages_el}
			class="flex flex-1 flex-col gap-3 overflow-y-auto pr-1"
			data-testid="chat-messages"
		>
			{#each chat_state.get_messages() as message, index (index)}
				{#if message.role === 'user'}
					<div class={USER_BUBBLE_CLASS}>
						<p class={TEXT_CLASS}>{message.text}</p>
					</div>
				{:else}
					<div class={ASSISTANT_BUBBLE_CLASS}>
						{#if message.text}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							<p class={TEXT_CLASS}>{@html linkify.to_html(message.text, LINK_CLASS)}</p>
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
		</div>

		<form class="mt-4 flex shrink-0 gap-2" onsubmit={handle_submit}>
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
				data-testid="chat-send"
				class="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
			>
				{CHAT_LABELS.SEND}
			</button>
		</form>
	</div>
</PageLayout>
