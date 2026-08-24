<script lang="ts">
	import { AUTHOR } from '$lib/app'
	import SocialLinkItem from '$lib/components/SocialLinkItem.svelte'
	import { LINK_BASE_CLASS } from '$lib/constants/layout'
	import { NAV_ICON_SIZE, SOCIAL_LINK_MOBILE_CLASSES } from '$lib/constants/sticky-header-constants'
	import { SOCIAL_LINKS } from '$lib/data/social-links'
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import { PAGES } from '$lib/types/page'

	const AVATAR_SIZE = 40
</script>

<!--
	Who wrote the article the reader just finished, and where to verify that person exists — the
	E-E-A-T signal a post page was missing while /about already carried it (#475). The site logo
	stands in for a portrait so this adds no new asset, and every link comes from `URLS` through
	`SOCIAL_LINKS`, so there is still one place where those addresses are written down.
-->
<aside
	class="mt-12 rounded-2xl border border-white/5 bg-slate-900/50 p-6"
	data-testid="author-box"
	aria-label="Author"
>
	<div class="flex items-start gap-4">
		<div
			class="shrink-0 rounded-xl border border-sky-400/20 bg-sky-500/10 p-2 text-sky-400 ring-1 ring-sky-400/20 ring-inset"
		>
			<LogoIcon size={AVATAR_SIZE} />
		</div>

		<div class="min-w-0">
			<p class="m-0! text-lg font-medium text-white/90">{AUTHOR.NAME}</p>
			<p class="mt-2 mb-0! text-sm leading-relaxed text-white/60">{AUTHOR.BIO}</p>

			<div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
				<a href={PAGES.ABOUT.link} class={LINK_BASE_CLASS} data-testid="author-box-about-link">
					このサイトについて
				</a>

				<nav class="flex items-center gap-1" aria-label="Author profiles">
					{#each SOCIAL_LINKS as link (link.href)}
						<SocialLinkItem {link} class={SOCIAL_LINK_MOBILE_CLASSES} icon_size={NAV_ICON_SIZE} />
					{/each}
				</nav>
			</div>
		</div>
	</div>
</aside>
