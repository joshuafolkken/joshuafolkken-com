<script lang="ts">
	import { goto } from '$app/navigation'
	import HighlightedText from '$lib/components/HighlightedText.svelte'
	import { SEARCH_GROUP_LABELS, SEARCH_LABELS } from '$lib/constants/search'
	import { search_state } from '$lib/hooks/SearchState.svelte'
	import SearchIcon from '$lib/icons/SearchIcon.svelte'
	import type { SearchResult } from '$lib/types/search'
	import { keyboard_utilities } from '$lib/utils/keyboard-utilities'
	import { text_highlight } from '$lib/utils/text-highlight'

	const SEARCH_HOTKEY_CODE = 'KeyK'
	const MOVE_DELTAS: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 }

	const BACKDROP_CLASS = 'fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm'
	const WRAPPER_CLASS =
		'pointer-events-none fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24'
	const PANEL_CLASS =
		'pointer-events-auto flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl'
	const INPUT_ROW_CLASS = 'flex items-center gap-3 border-b border-white/10 px-4 py-3 text-white/70'
	const INPUT_CLASS =
		'w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none'
	const GROUP_TITLE_CLASS =
		'px-4 pt-3 pb-1 text-xs font-semibold tracking-wide text-sky-400 uppercase'
	const RESULT_BASE_CLASS = 'block rounded-lg px-4 py-2 hover:bg-white/10'
	const RESULT_SELECTED_CLASS = 'bg-white/10'
	const STATE_TEXT_CLASS = 'px-4 py-8 text-center text-sm text-white/50'
	const RESULT_TITLE_CLASS = 'block text-sm font-medium text-white'
	const RESULT_EXCERPT_CLASS = 'mt-0.5 block truncate text-xs text-white/50'

	const is_open = $derived(search_state.get_is_open())
	const query = $derived(search_state.get_query())
	const groups = $derived(search_state.get_groups())
	const is_loading = $derived(search_state.get_is_loading())
	const has_query = $derived(query.trim().length > 0)
	const has_results = $derived(search_state.get_result_count() > 0)

	let input_el = $state<HTMLInputElement | undefined>()
	let results_el = $state<HTMLElement | undefined>()

	// Focus the input on open; restore focus to the trigger on close.
	$effect(() => {
		const previously_focused = is_open ? document.activeElement : undefined
		if (is_open) input_el?.focus()

		return () => {
			if (previously_focused instanceof HTMLElement) previously_focused.focus()
		}
	})

	// Lock background page scroll while the dialog is open; restore on close.
	$effect(() => {
		const root = document.documentElement
		const previous_overflow = root.style.overflow

		if (is_open) root.style.overflow = 'hidden'

		return () => {
			root.style.overflow = previous_overflow
		}
	})

	// Keep the keyboard-selected result scrolled into view within the panel.
	$effect(() => {
		const index = search_state.get_selected_index()
		const count = search_state.get_result_count()

		if (index >= 0 && count > 0) {
			results_el?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' })
		}
	})

	function navigate(url: string): void {
		search_state.close()
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- internal pathname from our own index
		void goto(url)
	}

	function handle_select(event: MouseEvent, url: string): void {
		event.preventDefault()
		navigate(url)
	}

	function confirm_selection(event: KeyboardEvent): void {
		const selected = search_state.get_selected()
		if (!selected) return

		event.preventDefault()
		navigate(selected.url)
	}

	function handle_input_keydown(event: KeyboardEvent): void {
		// During IME composition, let arrows/Enter drive candidate selection, not the list.
		if (event.isComposing) return

		const delta = MOVE_DELTAS[event.key]

		if (delta !== undefined) {
			event.preventDefault()
			search_state.move_selection(delta)
		} else if (keyboard_utilities.is_enter(event)) {
			confirm_selection(event)
		} else if (keyboard_utilities.is_escape(event)) {
			search_state.close()
		}
	}

	function is_search_hotkey(event: KeyboardEvent): boolean {
		// event.code is layout-independent (Cmd/Ctrl + K), so keyboard layout does not matter.
		return event.code === SEARCH_HOTKEY_CODE && (event.metaKey || event.ctrlKey)
	}

	function handle_window_keydown(event: KeyboardEvent): void {
		if (is_search_hotkey(event)) {
			event.preventDefault()
			search_state.open()
		} else if (is_open && keyboard_utilities.is_escape(event)) {
			search_state.close()
		}
	}

	function is_result_selected(result: SearchResult): boolean {
		return result === search_state.get_selected()
	}

	function result_class(result: SearchResult): string {
		return is_result_selected(result)
			? `${RESULT_BASE_CLASS} ${RESULT_SELECTED_CLASS}`
			: RESULT_BASE_CLASS
	}
</script>

<svelte:window onkeydown={handle_window_keydown} />

{#if is_open}
	<div
		class={BACKDROP_CLASS}
		role="presentation"
		aria-hidden="true"
		onclick={() => {
			search_state.close()
		}}
	></div>

	<div class={WRAPPER_CLASS}>
		<div
			class={PANEL_CLASS}
			role="dialog"
			aria-modal="true"
			aria-label={SEARCH_LABELS.TRIGGER}
			data-testid="search-dialog"
		>
			<div class={INPUT_ROW_CLASS}>
				<SearchIcon size="1.25rem" aria_label={SEARCH_LABELS.TRIGGER} />
				<input
					bind:this={input_el}
					bind:value={
						() => query,
						(value: string) => {
							search_state.set_query(value)
						}
					}
					class={INPUT_CLASS}
					type="search"
					placeholder={SEARCH_LABELS.PLACEHOLDER}
					aria-label={SEARCH_LABELS.PLACEHOLDER}
					data-testid="search-input"
					autocomplete="off"
					onkeydown={handle_input_keydown}
				/>
			</div>

			<div bind:this={results_el} class="overflow-y-auto py-2">
				{#if is_loading}
					<p class={STATE_TEXT_CLASS} data-testid="search-loading">{SEARCH_LABELS.LOADING}</p>
				{:else if !has_query}
					<p class={STATE_TEXT_CLASS}>{SEARCH_LABELS.HINT}</p>
				{:else if !has_results}
					<p class={STATE_TEXT_CLASS} data-testid="search-no-results">{SEARCH_LABELS.NO_RESULTS}</p>
				{:else}
					{#each groups as group (group.type)}
						<section>
							<h3 class={GROUP_TITLE_CLASS}>{SEARCH_GROUP_LABELS[group.type]}</h3>
							<ul class="px-2">
								{#each group.results as result (result.id)}
									<li>
										<a
											href={result.url}
											class={result_class(result)}
											data-selected={is_result_selected(result)}
											data-testid="search-result"
											onclick={(event) => {
												handle_select(event, result.url)
											}}
										>
											<span class={RESULT_TITLE_CLASS}>
												<HighlightedText segments={text_highlight.highlight(result.title, query)} />
											</span>
											{#if result.excerpt}
												<span class={RESULT_EXCERPT_CLASS}>
													<HighlightedText
														segments={text_highlight.highlight(result.excerpt, query)}
													/>
												</span>
											{/if}
										</a>
									</li>
								{/each}
							</ul>
						</section>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Enlarge the native search clear (×) button hit area and show a pointer;
	   keep its default color. */
	input[type='search']::-webkit-search-cancel-button {
		cursor: pointer;
		margin-inline-start: 0.5rem;
		transform: scale(1.4);
	}
</style>
