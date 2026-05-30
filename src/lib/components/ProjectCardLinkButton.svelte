<script lang="ts">
	import { app } from '$lib/app'
	import LinkTypeIcon from '$lib/components/LinkTypeIcon.svelte'
	import { PROJECT_CARD_LINK_BUTTON_CLASS } from '$lib/constants/card-styles'
	import { ICON_SIZE_SM } from '$lib/constants/layout'
	import type { ProjectLink } from '$lib/types/project'
	import { link_utilities } from '$lib/utils/link-utilities'

	const { link, is_icon_only = false }: { link: ProjectLink; is_icon_only?: boolean } = $props()

	const link_info = $derived(link_utilities.get_link_info(link.href))
	const label = $derived(app.link_label(link.type))
</script>

<a
	href={link_info.href}
	target={link_info.target}
	rel={link_info.rel}
	class={PROJECT_CARD_LINK_BUTTON_CLASS}
	aria-label={is_icon_only ? label : undefined}
	title={is_icon_only ? label : undefined}
>
	<LinkTypeIcon type={link.type} size={ICON_SIZE_SM} />
	{#if !is_icon_only}
		{label}
	{/if}
</a>
