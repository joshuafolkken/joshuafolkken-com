<script lang="ts">
	import type { Snippet } from 'svelte'
	import PageFooter from './PageFooter.svelte'

	const { max_width = 'max-w-2xl', children } = $props<{
		max_width?: 'sm' | '2xl'
		children: Snippet
	}>()

	const max_width_class = $derived(max_width === 'sm' ? 'max-w-sm' : 'max-w-2xl')
	const padding_class = 'mx-4 my-8'
</script>

<div class="flex justify-center">
	<main class="{max_width_class} {padding_class} flex w-full flex-col">
		{@render children()}

		<PageFooter />
	</main>
</div>
