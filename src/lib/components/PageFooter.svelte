<script lang="ts">
	import { resolve } from '$app/paths'
	import { APP, AUTHOR } from '$lib/app'
	import HeartIcon from '$lib/icons/HeartIcon.svelte'
	import { PAGES } from '$lib/types/page'
	import ContentCard from './ContentCard.svelte'
	import Divider from './Divider.svelte'
	import LinkCard from './LinkCard.svelte'
	import SupportersList from './SupportersList.svelte'
</script>

<ContentCard icon={HeartIcon} title="Top Supporters" class="text-center">
	<SupportersList />
</ContentCard>

<Divider />
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
