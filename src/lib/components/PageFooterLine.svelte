<script lang="ts">
	import { resolve } from '$app/paths'
	import { APP, AUTHOR } from '$lib/app'
	import { PAGES } from '$lib/types/page'
</script>

<div
	class="mt-20 w-full border-t border-white/5 bg-linear-to-b from-transparent to-slate-900/30 py-16 text-center"
>
	<div class="flex flex-col items-center gap-1 text-sm text-white/60">
		{#if PAGES.PRIVACY_POLICY.link}
			<a href={resolve(PAGES.PRIVACY_POLICY.link as '/privacy-policy')} class="link-base">
				{PAGES.PRIVACY_POLICY.title}
			</a>
		{/if}
		<span>{AUTHOR.COPYRIGHT}</span>
		<a href={resolve('/')} class="link-base hidden" aria-hidden="true">
			v{APP.VERSION}
		</a>
	</div>
</div>
