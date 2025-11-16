<script lang="ts">
	import type { Snippet } from 'svelte'

	const { title, children } = $props<{
		title?: string | undefined
		children: Snippet
	}>()
</script>

<section>
	{#if title}
		<h2 class="mb-4 text-2xl font-light tracking-tight">{title}</h2>
	{/if}
	{@render children()}
</section>
