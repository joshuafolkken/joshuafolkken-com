<script lang="ts">
	import SocialLinkItem from '$lib/components/SocialLinkItem.svelte'
	import { HEADER_SOCIAL_LINKS } from '$lib/data/social-links'

	const {
		variant = 'desktop',
		on_click,
	}: {
		variant?: 'desktop' | 'mobile'
		on_click?: () => void
	} = $props()

	const link_classes = $derived(
		variant === 'desktop'
			? 'flex h-9 w-9 items-center justify-center rounded-xl bg-white/0 text-white/50 transition-all hover:scale-110 hover:bg-white/5 hover:text-white active:scale-95'
			: 'flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white',
	)

	const container_classes = $derived(
		variant === 'desktop'
			? 'hidden items-center gap-2 md:flex'
			: 'mt-4 flex gap-2 p-4 pt-0 md:hidden',
	)
</script>

<nav
	class={container_classes}
	aria-label={variant === 'desktop' ? 'ソーシャルリンク' : 'ソーシャルリンク（モバイル）'}
>
	{#each HEADER_SOCIAL_LINKS as link (link.href)}
		<SocialLinkItem
			{link}
			class={link_classes}
			icon_size="1.25rem"
			{...on_click ? { on_click } : {}}
		/>
	{/each}
</nav>
