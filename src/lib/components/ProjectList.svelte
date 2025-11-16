<script lang="ts">
	import type { Project } from '$lib/types/project'
	import ContentCard from './ContentCard.svelte'
	import Divider from './Divider.svelte'
	import ProjectLinks from './ProjectLinks.svelte'

	const { projects } = $props<{
		projects: Array<Project>
	}>()
</script>

{#each projects as project (project.title)}
	<ContentCard
		icon={project.icon}
		title={project.title}
		subtitle={project.subtitle}
		description={project.description}
	/>
	<ProjectLinks links={project.links} />
	{#if project !== projects.at(-1)}
		<Divider />
	{/if}
{/each}
