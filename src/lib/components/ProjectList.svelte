<script lang="ts">
	import type { Project } from '$lib/types/project'
	import ProjectCard from './ProjectCard.svelte'

	const { projects } = $props<{
		projects: Array<Project>
	}>()
</script>

<div class="grid gap-8 sm:grid-cols-2">
	{#each projects as project (project.title)}
		<ProjectCard {project} />
	{/each}
</div>
