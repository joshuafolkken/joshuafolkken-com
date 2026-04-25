<script lang="ts">
	// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- SvelteKit convention: app.css must reside at src/ root
	import '../app.css'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'
	import { page } from '$app/state'
	import { APP, AUTHOR } from '$lib/app'
	import favicon from '$lib/assets/logo.svg'
	import StickyHeader from '$lib/components/StickyHeader.svelte'
	import { SKIP_LINK_TARGET_ID } from '$lib/constants/layout'
	import {
		PROGRESS_BAR_SETTLE_MS,
		PROGRESS_BAR_THRESHOLD_MS,
		PROGRESS_BAR_Z_INDEX,
	} from '$lib/constants/navigation-progress'
	import { sticky_header_state } from '$lib/hooks/StickyHeaderState.svelte'
	import { font_load_handler } from '$lib/utils/font-load-handler'
	import type { Snippet } from 'svelte'

	interface Props {
		children: Snippet
	}

	const GOOGLE_FONTS_URL =
		'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap'

	const SKIP_LINK_CLASS =
		'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg focus:outline-none'

	const { children }: Props = $props()

	const is_menu_open = $derived(sticky_header_state.get_is_menu_open())
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{AUTHOR.NAME}</title>
	<meta name="description" content={APP.DESCRIPTION} />
	<link rel="canonical" href={page.url.href} />
	<link rel="preload" as="style" href={GOOGLE_FONTS_URL} />
	<link
		rel="stylesheet"
		href={GOOGLE_FONTS_URL}
		media="print"
		onload={font_load_handler.on_font_load}
	/>
	<noscript>
		<link rel="stylesheet" href={GOOGLE_FONTS_URL} />
	</noscript>
</svelte:head>

<a href="#{SKIP_LINK_TARGET_ID}" class={SKIP_LINK_CLASS}>Skip to main content</a>

<ProgressBar
	class="text-sky-400"
	displayThresholdMs={PROGRESS_BAR_THRESHOLD_MS}
	settleTime={PROGRESS_BAR_SETTLE_MS}
	zIndex={PROGRESS_BAR_Z_INDEX}
/>
<StickyHeader />
<main id={SKIP_LINK_TARGET_ID} class="pt-16" inert={is_menu_open}>
	{@render children()}
</main>
