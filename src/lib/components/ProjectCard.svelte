<script lang="ts">
	import { resolve } from '$app/paths'
	import { CARD_WRAPPER_CLASS } from '$lib/constants/card-styles'
	import type { Project } from '$lib/types/project'
	import ProjectCardContent from './ProjectCardContent.svelte'
	import ProjectCardLinkButton from './ProjectCardLinkButton.svelte'

	const { project } = $props<{
		project: Project
	}>()

	const detail_href = $derived(resolve('/projects/[slug]', { slug: project.slug }))
</script>

<div class={CARD_WRAPPER_CLASS}>
	<!-- Stretched link: whole card navigates to the detail page; title-row links sit above it. -->
	<a href={detail_href} class="absolute inset-0 z-10" aria-label={project.title}></a>
	<ProjectCardContent {project}>
		{#snippet header_actions()}
			{#each project.links as link (link.href)}
				<ProjectCardLinkButton {link} is_icon_only />
			{/each}
		{/snippet}
	</ProjectCardContent>
</div>
