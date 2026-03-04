<script lang="ts">
	import '../app.css'
	import { APP, AUTHOR } from '$lib/app'
	import favicon from '$lib/assets/logo.svg'
	import StickyHeader from '$lib/components/StickyHeader.svelte'

	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{AUTHOR.NAME}</title>
	<meta name="description" content={APP.DESCRIPTION} />
</svelte:head>

<StickyHeader />
<main class="pt-16">
	{@render children()}
</main>
