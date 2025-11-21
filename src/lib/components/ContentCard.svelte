<script lang="ts">
	import type { Component, Snippet } from 'svelte'

	interface Props {
		icon?: Component | undefined
		title: string
		subtitle?: string | undefined
		description?: string | undefined
		class?: string | undefined
		children?: Snippet | undefined
	}

	const { icon, title, subtitle, description, class: class_name, children }: Props = $props()

	const is_centered = class_name?.includes('text-center') ?? false
	const justify_class = is_centered ? 'justify-center' : ''
</script>

<section class={class_name}>
	<h2 class="mb-2 flex items-center {justify_class} gap-2 text-xl font-medium">
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
	{#if children}
		{@render children()}
	{/if}
</section>
