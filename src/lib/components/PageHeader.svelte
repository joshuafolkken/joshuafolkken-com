<script lang="ts">
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import type { Component } from 'svelte'

	const { icon, title, subtitle } = $props<{
		icon?: Component | undefined
		title: string
		subtitle?: string | undefined
	}>()
</script>

<header class="flex flex-col items-center justify-center">
	<div class="my-4">
		<LogoIcon />
	</div>
	<h1 class="flex items-center justify-center gap-2 text-3xl font-light tracking-tight">
		{#if icon}
			{@render icon({ size: '1.8rem' })}
		{/if}
		{title}
	</h1>
	{#if subtitle}
		<p class="mt-1 text-right text-white/80 italic">{subtitle}</p>
	{/if}
</header>
