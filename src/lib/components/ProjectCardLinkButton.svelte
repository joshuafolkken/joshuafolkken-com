<script lang="ts">
	import { app } from '$lib/app'
	import { PROJECT_CARD_LINK_BUTTON_CLASS } from '$lib/constants/card-styles'
	import { ICON_SIZE_SM } from '$lib/constants/layout'
	import BlogIcon from '$lib/icons/BlogIcon.svelte'
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import PackageIcon from '$lib/icons/PackageIcon.svelte'
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
	{#if link.type === 'blog'}
		<BlogIcon size={ICON_SIZE_SM} />
	{:else if link.type === 'github'}
		<GitHubIcon size={ICON_SIZE_SM} />
	{:else if link.type === 'npm'}
		<PackageIcon size={ICON_SIZE_SM} />
	{/if}
	{app.link_label(link.type)}
</a>
