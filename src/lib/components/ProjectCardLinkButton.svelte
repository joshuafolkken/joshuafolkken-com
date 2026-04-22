<script lang="ts">
	import { app } from '$lib/app'
	import LinkTypeIcon from '$lib/components/LinkTypeIcon.svelte'
	import { PROJECT_CARD_LINK_BUTTON_CLASS } from '$lib/constants/card-styles'
	import { ICON_SIZE_SM } from '$lib/constants/layout'
	import type { ProjectLink } from '$lib/types/project'
	import { link_utilities } from '$lib/utils/link-utilities'

	const { link }: { link: ProjectLink } = $props()

	const link_info = $derived(link_utilities.get_link_info(link.href))
</script>

<a
	href={link_info.href}
	target={link_info.target}
	rel={link_info.rel}
	class={PROJECT_CARD_LINK_BUTTON_CLASS}
>
	<LinkTypeIcon type={link.type} size={ICON_SIZE_SM} />
	{app.link_label(link.type)}
</a>
