<script lang="ts">
	// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- SvelteKit convention: app.css must reside at src/ root
	import '../app.css'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'
	import { page } from '$app/state'
	import { APP, AUTHOR } from '$lib/app'
	import favicon from '$lib/assets/logo.svg'
	import SearchDialog from '$lib/components/SearchDialog.svelte'
	import StickyHeader from '$lib/components/StickyHeader.svelte'
	import { SKIP_LINK_TARGET_ID } from '$lib/constants/layout'
	import {
		PROGRESS_BAR_SETTLE_MS,
		PROGRESS_BAR_THRESHOLD_MS,
		PROGRESS_BAR_Z_INDEX,
	} from '$lib/constants/navigation-progress'
	import { search_state } from '$lib/hooks/SearchState.svelte'
	import { sticky_header_state } from '$lib/hooks/StickyHeaderState.svelte'
	import { onMount, type Snippet } from 'svelte'

	interface Props {
		children: Snippet
	}

	const GOOGLE_FONTS_URL =
		'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap'

	const SKIP_LINK_CLASS =
		'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg focus:outline-none'

	const { children }: Props = $props()

	const is_menu_open = $derived(sticky_header_state.get_is_menu_open())
	const is_page_inert = $derived(is_menu_open || search_state.get_is_open())

	// E2E hydration marker (#807). SSR markup is actionable before the client has attached its
	// event handlers, and Playwright's actionability checks cannot see that gap — on the vite dev
	// server it stretches to 1.6s+ under parallel-worker contention, so one-shot clicks and
	// key presses fired at first visibility are silently lost. This layout's onMount runs after
	// every child has mounted, so the attribute below flips exactly when interactions become
	// safe; `test_hydration.goto_hydrated` waits for it before interacting.
	let is_hydrated = $state(false)

	onMount(() => {
		is_hydrated = true
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{AUTHOR.NAME}</title>
	<meta name="description" content={APP.DESCRIPTION} />
	<link rel="canonical" href={page.url.href} />
	<link rel="preload" as="style" href={GOOGLE_FONTS_URL} />
	<!-- Loaded as `print` so it never blocks first paint, then swapped to `all` once ready.
	     Svelte strips this comment in production, so the full rationale lives here rather than
	     in `src/app.html`, whose comments are served on every request.

	     The swap runs in the nonce-tagged bootstrap at the end of `src/app.html`'s head, which
	     matches this link by `data-font-css`. It cannot be an inline `onload=` attribute: that
	     is what forced `script-src-attr 'unsafe-inline'` into the CSP (#799). It also cannot
	     wait for `onMount`, which would push the swap past hydration and lengthen FOUT. The
	     bootstrap has to handle a stylesheet that finished loading before it ran (a cached
	     response), hence the `link.sheet` branch — no load event is left to listen for.

	     Measured on a throttled connection: dropping `media="print"` for a plain render-blocking
	     stylesheet costs ~3.7s of FCP, so the swap is worth its complexity. -->
	<link rel="stylesheet" href={GOOGLE_FONTS_URL} media="print" data-font-css />
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
<SearchDialog />
<main
	id={SKIP_LINK_TARGET_ID}
	class="pt-16"
	inert={is_page_inert}
	data-hydrated={is_hydrated ? 'true' : undefined}
>
	{@render children()}
</main>
