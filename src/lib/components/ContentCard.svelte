<script lang="ts">
	import { ICON_SIZE_LG } from '$lib/constants/layout'
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

	const is_centered = $derived(class_name?.includes('text-center') ?? false)
	const justify_class = $derived(is_centered ? 'justify-center' : '')
</script>

<section class={class_name}>
	<h2 class="mb-4 flex items-center {justify_class} gap-2 text-2xl font-light tracking-tight">
		{#if icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = icon}
			<Icon size={ICON_SIZE_LG} />
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
