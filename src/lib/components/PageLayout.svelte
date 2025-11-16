<script lang="ts">
	import type { Snippet } from 'svelte'

	const {
		max_width = 'sm',
		padding = 'default',
		children,
	} = $props<{
		max_width?: 'sm' | '2xl'
		padding?: 'default' | 'compact'
		children: Snippet
	}>()

	const max_width_class = max_width === 'sm' ? 'max-w-sm' : 'max-w-2xl'
	const padding_class = padding === 'compact' ? 'px-4 py-8' : 'mx-4 my-8'
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="flex justify-center">
	<main class="{max_width_class} {padding_class} flex w-full flex-col">
		{@render children()}
	</main>
</div>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
