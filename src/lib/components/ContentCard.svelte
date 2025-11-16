<script lang="ts">
	import type { Component } from 'svelte'

	const { icon, title, subtitle, description } = $props<{
		icon: Component
		title: string
		subtitle?: string | undefined
		description?: string | undefined
	}>()
</script>

<section>
	<h2 class="mb-2 flex items-center gap-2 text-xl font-medium">
		{@render icon({ size: '1.5rem' })}
		<strong>{title}</strong>
		{#if subtitle}
			- <em>{subtitle}</em>
		{/if}
	</h2>
	{#if description}
		<p>{description}</p>
	{/if}
</section>
