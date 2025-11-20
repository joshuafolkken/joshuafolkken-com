<script lang="ts">
	import { get_link_label, LINK_REL, LINK_TARGET } from '$lib/app'
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
			class="link-base flex items-center gap-2 text-white/80"
		>
			{#if link.type === 'github'}
				<GitHubIcon size="1rem" />
			{:else if link.type === 'demo'}
				<LiveDemoIcon size="1rem" />
			{/if}
			{get_link_label(link.type)}
		</a>
	{/each}
</div>
