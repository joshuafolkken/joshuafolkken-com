<script lang="ts">
	import { app, LINK_REL, LINK_TARGET } from '$lib/app'
	import { ICON_SIZE_SM, LINK_BASE_DEFAULT_CLASS } from '$lib/constants/layout'
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import LiveDemoIcon from '$lib/icons/LiveDemoIcon.svelte'
	import type { ProjectLink } from '$lib/types/project'

	const { links } = $props<{
		links: Array<ProjectLink>
	}>()
</script>

<div class="mt-2 flex flex-wrap gap-5">
	{#each links as link (link.href)}
		<a
			href={link.href}
			target={LINK_TARGET}
			rel={LINK_REL}
			class="{LINK_BASE_DEFAULT_CLASS} flex items-center gap-2"
		>
			{#if link.type === 'github'}
				<GitHubIcon size={ICON_SIZE_SM} />
			{:else if link.type === 'demo'}
				<LiveDemoIcon size={ICON_SIZE_SM} />
			{/if}
			{app.link_label(link.type)}
		</a>
	{/each}
</div>
