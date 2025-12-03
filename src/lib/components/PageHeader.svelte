<script lang="ts">
	import { StickyHeaderState } from '$lib/hooks/StickyHeaderState.svelte'
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import type { Page } from '$lib/types/page'
	import { onMount } from 'svelte'

	interface Props {
		page: Page
	}

	const STICKY_HEADER_SIZE = 32

	const { page }: Props = $props()
	const { icon, title, description } = $derived(page)

	const sticky_state = new StickyHeaderState()
	let header_element = $state<HTMLElement | undefined>()

	$effect(() => {
		if (header_element !== undefined) {
			sticky_state.set_element(header_element)
			sticky_state.update_sticky_state()
		}
	})

	function handle_scroll(): void {
		sticky_state.handle_scroll()
	}

	onMount(() => {
		window.addEventListener('scroll', handle_scroll, { passive: true })

		return () => {
			window.removeEventListener('scroll', handle_scroll)
			sticky_state.destroy()
		}
	})
</script>

<header
	bind:this={header_element}
	class="mb-4 flex flex-col items-center justify-center transition-all duration-300"
	class:opacity-0={sticky_state.is_sticky}
	class:pointer-events-none={sticky_state.is_sticky}
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
	class:translate-y-0={sticky_state.is_sticky}
	class:-translate-y-full={!sticky_state.is_sticky}
>
	<LogoIcon size={STICKY_HEADER_SIZE} />
	<h1 class="text-2xl font-light tracking-tight">
		{title}
	</h1>
</header>
