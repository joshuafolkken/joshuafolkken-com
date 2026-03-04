<script lang="ts">
	import SocialLinkItem from '$lib/components/SocialLinkItem.svelte'
	import {
		NAV_ICON_SIZE,
		SOCIAL_LINK_CONTAINER_DESKTOP,
		SOCIAL_LINK_CONTAINER_MOBILE,
		SOCIAL_LINK_DESKTOP_CLASSES,
		SOCIAL_LINK_MOBILE_CLASSES,
		type StickyHeaderVariant,
	} from '$lib/constants/sticky-header-constants'
	import { HEADER_SOCIAL_LINKS } from '$lib/data/social-links'
	import { property_utilities } from '$lib/utils/property-utilities'

	const {
		variant = 'desktop',
		on_click,
	}: {
		variant?: StickyHeaderVariant
		on_click?: () => void
	} = $props()

	const is_desktop = $derived(variant === 'desktop')

	const link_classes = $derived(
		is_desktop ? SOCIAL_LINK_DESKTOP_CLASSES : SOCIAL_LINK_MOBILE_CLASSES,
	)

	const container_classes = $derived(
		is_desktop ? SOCIAL_LINK_CONTAINER_DESKTOP : SOCIAL_LINK_CONTAINER_MOBILE,
	)
</script>

<nav
	class={container_classes}
	aria-label={is_desktop ? 'ソーシャルリンク' : 'ソーシャルリンク（モバイル）'}
>
	{#each HEADER_SOCIAL_LINKS as link (link.href)}
		<SocialLinkItem
			{link}
			class={link_classes}
			icon_size={NAV_ICON_SIZE}
			{...property_utilities.with_optional_on_click(on_click)}
		/>
	{/each}
</nav>
