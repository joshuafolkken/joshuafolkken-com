<script lang="ts">
	// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- SvelteKit convention: app.css must reside at src/ root
	import '../app.css'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'
	import { APP, AUTHOR } from '$lib/app'
	import favicon from '$lib/assets/logo.svg'
	import StickyHeader from '$lib/components/StickyHeader.svelte'
	import {
		PROGRESS_BAR_SETTLE_MS,
		PROGRESS_BAR_THRESHOLD_MS,
		PROGRESS_BAR_Z_INDEX,
	} from '$lib/constants/navigation-progress'
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
	}

	const { children }: Props = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{AUTHOR.NAME}</title>
	<meta name="description" content={APP.DESCRIPTION} />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
	/>
</svelte:head>

<ProgressBar
	class="text-sky-400"
	displayThresholdMs={PROGRESS_BAR_THRESHOLD_MS}
	settleTime={PROGRESS_BAR_SETTLE_MS}
	zIndex={PROGRESS_BAR_Z_INDEX}
/>
<StickyHeader />
<main class="pt-16">
	{@render children()}
</main>
