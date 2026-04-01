<script lang="ts">
	// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- SvelteKit convention: app.css must reside at src/ root
	import '../app.css'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'
	import { APP, AUTHOR } from '$lib/app'
	import favicon from '$lib/assets/logo.svg'
	import StickyHeader from '$lib/components/StickyHeader.svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
	}

	const { children }: Props = $props()

	/** StickyHeader uses z-50; keep the bar above it during client navigations. */
	const progress_bar_z_index = 100
	/** 0 = show on every client navigation (no minimum before the bar appears). */
	const bar_show_threshold_ms = 0
	const bar_settle_ms = 200
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{AUTHOR.NAME}</title>
	<meta name="description" content={APP.DESCRIPTION} />
</svelte:head>

<ProgressBar
	class="text-sky-400"
	displayThresholdMs={bar_show_threshold_ms}
	settleTime={bar_settle_ms}
	zIndex={progress_bar_z_index}
/>
<StickyHeader />
<main class="pt-16">
	{@render children()}
</main>
