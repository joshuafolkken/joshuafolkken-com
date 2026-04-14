<script lang="ts">
	import { resolve } from '$app/paths'
	import { APP, AUTHOR } from '$lib/app'
	import { CONTENT_EDGE_SPACING_CLASS, LINK_BASE_CLASS } from '$lib/constants/layout'
	import { PAGES } from '$lib/types/page'

	const FOOTER_LINKS = [
		{ href: resolve('/contact'), title: PAGES.CONTACT.title },
		{ href: resolve('/privacy'), title: PAGES.PRIVACY_POLICY.title },
		{ href: resolve('/terms'), title: PAGES.TERMS_OF_SERVICE.title },
	]
</script>

<div
	class="{CONTENT_EDGE_SPACING_CLASS} w-full border-t border-white/5 bg-slate-900/50 py-8 text-center"
>
	<div class="flex flex-col items-center gap-1 text-sm text-white/60">
		<div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
			{#each FOOTER_LINKS as footer_link, index (footer_link.href)}
				{#if index > 0}
					<span aria-hidden="true">·</span>
				{/if}
				<a href={footer_link.href} class={LINK_BASE_CLASS}>{footer_link.title}</a>
			{/each}
		</div>
		<span>{AUTHOR.COPYRIGHT}</span>
		<a href={resolve('/')} class="{LINK_BASE_CLASS} hidden" aria-hidden="true">
			v{APP.VERSION}
		</a>
	</div>
</div>
