<script lang="ts">
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import type { Page } from '$lib/types/page'
	import { onMount } from 'svelte'

	interface Props {
		page: Page
	}

	const STICKY_THRESHOLD = -90
	const STICKY_HEADER_SIZE = 32
	const DEBOUNCE_DELAY = 10

	const { page }: Props = $props()
	const { icon, title, description } = page

	let is_sticky = $state(false)
	let header_element = $state<HTMLElement | undefined>()
	let debounce_timer = $state<ReturnType<typeof setTimeout> | undefined>()

	function update_sticky_state(): void {
		if (header_element === undefined) return
		const header_rect = header_element.getBoundingClientRect()
		is_sticky = header_rect.top < STICKY_THRESHOLD
	}

	function handle_scroll(): void {
		clearTimeout(debounce_timer)
		debounce_timer = setTimeout(update_sticky_state, DEBOUNCE_DELAY)
	}

	onMount(() => {
		window.addEventListener('scroll', handle_scroll, { passive: true })
		update_sticky_state()

		return () => {
			window.removeEventListener('scroll', handle_scroll)
			clearTimeout(debounce_timer)
		}
	})
</script>

<header
	bind:this={header_element}
	class="flex flex-col items-center justify-center transition-all duration-300"
	class:opacity-0={is_sticky}
	class:pointer-events-none={is_sticky}
>
	<div class="my-4">
		<LogoIcon />
	</div>
	<h1 class="flex items-center justify-center gap-2 text-3xl font-light tracking-tight">
		{#if icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = icon}
			<Icon size="1.8rem" />
		{/if}
		{title}
	</h1>
	{#if description !== ''}
		<p class="mt-1 text-right text-white/80 italic">{description}</p>
	{/if}
</header>

<header
	class="fixed top-0 right-0 left-0 z-50 flex items-center justify-center gap-2 bg-slate-900 p-4 shadow-lg transition-all duration-300"
	class:translate-y-0={is_sticky}
	class:-translate-y-full={!is_sticky}
>
	<LogoIcon size={STICKY_HEADER_SIZE} />
	<h1 class="text-2xl font-light tracking-tight">
		{title}
	</h1>
</header>
