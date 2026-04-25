<script lang="ts">
	import { page } from '$app/state'
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import { SOCIAL_BUTTONS } from '$lib/constants/social-buttons'
	import FacebookIcon from '$lib/icons/FacebookIcon.svelte'
	import XIcon from '$lib/icons/XIcon.svelte'
	import { share_url_utilities } from '$lib/utils/share-url-utilities'

	type ShareType = 'facebook' | 'twitter'

	interface ShareConfig {
		hover_class: string
		aria_label: string
		icon_size: string
	}

	interface Props {
		type: ShareType
		title?: string
		class?: string
	}

	const SHARE_CONFIG = {
		facebook: {
			hover_class: SOCIAL_BUTTONS.FACEBOOK_HOVER,
			aria_label: 'Share on Facebook',
			icon_size: '1.5rem',
		},
		twitter: {
			hover_class: SOCIAL_BUTTONS.TWITTER_HOVER,
			aria_label: 'Share on X',
			icon_size: '1.25rem',
		},
	} as const satisfies Record<ShareType, ShareConfig>

	const { type, title = '', class: class_name = '' }: Props = $props()

	const url = $derived(page.url.toString())
	const config = $derived(SHARE_CONFIG[type])
	const href = $derived(
		type === 'facebook'
			? share_url_utilities.build_facebook_share_url(url)
			: share_url_utilities.build_twitter_share_url(url, title),
	)
</script>

<a
	{href}
	target={LINK_TARGET}
	rel={LINK_REL}
	class="{SOCIAL_BUTTONS.BASE} {config.hover_class} {class_name}"
	aria-label={config.aria_label}
>
	{#if type === 'facebook'}
		<FacebookIcon size={config.icon_size} />
	{:else}
		<XIcon size={config.icon_size} />
	{/if}
</a>
