<script lang="ts">
	import { resolve } from '$app/paths'
	import { APP, AUTHOR } from '$lib/app'
	import { PAGES } from '$lib/types/page'
	import Divider from './Divider.svelte'
	import LinkCard from './LinkCard.svelte'
</script>

<LinkCard page={PAGES.DONATIONS} />

<Divider />
<footer class="mt space-y-1 text-center text-sm text-white/60">
	{#if PAGES.PRIVACY_POLICY.link}
		<a href={resolve(PAGES.PRIVACY_POLICY.link as '/privacy-policy')} class="link-base">
			{PAGES.PRIVACY_POLICY.title}
		</a>
	{/if}
	<div class="mt-4">
		<a href={resolve('/')} class="link-base inline-block">
			<p>{APP.NAME} v{APP.VERSION}</p>
			<p>{AUTHOR.COPYRIGHT}</p>
		</a>
	</div>
</footer>
