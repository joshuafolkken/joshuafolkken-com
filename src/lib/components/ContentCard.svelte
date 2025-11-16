<script lang="ts">
	import type { Component } from 'svelte'

	interface Props {
		icon?: Component | undefined
		title: string
		subtitle?: string | undefined
		description?: string | undefined
	}

	const { icon, title, subtitle, description }: Props = $props()
</script>

<section>
	<h2 class="mb-2 flex items-center gap-2 text-xl font-medium">
		{#if icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = icon}
			<Icon size="1.5rem" />
		{/if}
		<strong>{title}</strong>
		{#if subtitle}
			- <em>{subtitle}</em>
		{/if}
	</h2>
	{#if description}
		<p>{description}</p>
	{/if}
</section>
