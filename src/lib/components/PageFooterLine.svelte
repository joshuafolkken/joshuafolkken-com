<script lang="ts">
	import { resolve } from '$app/paths'
	import { APP, AUTHOR } from '$lib/app'
	import { CONTENT_EDGE_SPACING_CLASS, LINK_BASE_CLASS } from '$lib/constants/layout'
	import { PAGES } from '$lib/types/page'
</script>

<div
	class="{CONTENT_EDGE_SPACING_CLASS} w-full border-t border-white/5 bg-slate-900/50 py-8 text-center"
>
	<div class="flex flex-col items-center gap-1 text-sm text-white/60">
		<div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
			{#if PAGES.PRIVACY_POLICY.link}
				<a href={resolve(PAGES.PRIVACY_POLICY.link as '/privacy')} class={LINK_BASE_CLASS}>
					{PAGES.PRIVACY_POLICY.title}
				</a>
			{/if}
			{#if PAGES.PRIVACY_POLICY.link && PAGES.TERMS_OF_SERVICE.link}
				<span aria-hidden="true">·</span>
			{/if}
			{#if PAGES.TERMS_OF_SERVICE.link}
				<a href={resolve(PAGES.TERMS_OF_SERVICE.link as '/terms')} class={LINK_BASE_CLASS}>
					{PAGES.TERMS_OF_SERVICE.title}
				</a>
			{/if}
		</div>
		<span>{AUTHOR.COPYRIGHT}</span>
		<a href={resolve('/')} class="{LINK_BASE_CLASS} hidden" aria-hidden="true">
			v{APP.VERSION}
		</a>
	</div>
</div>
