<script lang="ts">
	import type { Snippet } from 'svelte'
	import PageFooter from './PageFooter.svelte'
	import PageFooterLine from './PageFooterLine.svelte'

	const { max_width = '2xl', children } = $props<{
		max_width?: 'sm' | '2xl' | '3xl' | '4xl'
		children: Snippet
	}>()

	function get_max_width_class(width: string): string {
		if (width === 'sm') return 'max-w-sm'
		if (width === '3xl') return 'max-w-3xl'
		if (width === '4xl') return 'max-w-4xl'
		return 'max-w-2xl'
	}
	const max_width_class = $derived(get_max_width_class(max_width))
	const padding_class = 'mx-4 mt-8 mb-0'
</script>

<div class="flex w-full flex-col">
	<div class="flex justify-center">
		<main class="{max_width_class} {padding_class} flex w-full flex-col">
			{@render children()}

			<PageFooter />
		</main>
	</div>
	<PageFooterLine />
</div>
