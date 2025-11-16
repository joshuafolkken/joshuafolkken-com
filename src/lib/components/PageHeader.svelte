<script lang="ts">
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import type { Page } from '$lib/types/page'

	interface Props {
		page: Page
	}

	const { page }: Props = $props()
	const { icon, title, description } = page
</script>

<header class="flex flex-col items-center justify-center">
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
	{#if description}
		<p class="mt-1 text-right text-white/80 italic">{description}</p>
	{/if}
</header>
