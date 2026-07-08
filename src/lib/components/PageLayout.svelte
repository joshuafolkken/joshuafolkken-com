<script lang="ts">
	import { get_max_width_class, PAGE_PADDING_CLASS, type MaxWidthKey } from '$lib/constants/layout'
	import type { Snippet } from 'svelte'
	import PageFooter from './PageFooter.svelte'
	import PageFooterLine from './PageFooterLine.svelte'

	const {
		max_width = '6xl',
		has_footer = true,
		children,
	} = $props<{
		max_width?: MaxWidthKey
		has_footer?: boolean
		children: Snippet
	}>()

	const max_width_class = $derived(get_max_width_class(max_width))
</script>

<div class="flex w-full flex-col">
	<div class="flex justify-center">
		<main class="{max_width_class} {PAGE_PADDING_CLASS} flex w-full flex-col">
			{@render children()}

			{#if has_footer}
				<PageFooter />
			{/if}
		</main>
	</div>
	{#if has_footer}
		<PageFooterLine />
	{/if}
</div>
