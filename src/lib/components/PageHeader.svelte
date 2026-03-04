<script lang="ts">
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import { PAGES, type Page } from '$lib/types/page'

	interface Props {
		page: Page
	}

	const { page }: Props = $props()
	const { icon, title, description } = $derived(page)
	const is_top_page = $derived(page === PAGES.TOP)
</script>

<header class="mb-4 flex flex-col items-center justify-center {is_top_page ? '' : 'mt-6'}">
	{#if is_top_page}
		<div class="my-4">
			<LogoIcon />
		</div>
	{/if}
	<h1 class="flex items-center justify-center gap-2 text-4xl font-light tracking-tight">
		{#if icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = icon}
			<Icon size="2.25rem" />
		{/if}
		{title}
	</h1>
	{#if description}
		<p class="mt-3 text-right text-white/80 italic">{description}</p>
	{/if}
</header>
