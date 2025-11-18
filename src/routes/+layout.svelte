<script lang="ts">
	import '../app.css'
	import { APP, AUTHOR } from '$lib/app'
	import favicon from '$lib/assets/logo.svg'

	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{AUTHOR.NAME}</title>
	<meta name="description" content={APP.DESCRIPTION} />
</svelte:head>

{@render children()}
