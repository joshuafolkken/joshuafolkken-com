<script lang="ts">
	import type { Snippet } from 'svelte'

	const {
		title,
		class: class_name,
		children,
	} = $props<{
		title?: string | undefined
		class?: string | undefined
		children: Snippet
	}>()
</script>

<section class="my-6 {class_name}">
	{#if title}
		<h2 class="mb-4 text-2xl font-light tracking-tight">{title}</h2>
	{/if}
	{@render children()}
</section>
