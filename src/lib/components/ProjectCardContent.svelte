<script lang="ts">
	import CardImage from '$lib/components/CardImage.svelte'
	import { CARD_DESCRIPTION_CLASS, CARD_TITLE_CLASS } from '$lib/constants/card-styles'
	import { ICON_SIZE_LG } from '$lib/constants/layout'
	import type { Project } from '$lib/types/project'

	const { project, has_github_link = false } = $props<{
		project: Project
		has_github_link?: boolean
	}>()

	const project_icon = $derived(project.icon)
</script>

{#if project.image}
	<CardImage src={project.image} alt={project.title} />
{/if}
<div class="flex flex-1 flex-col p-6 {has_github_link ? 'pb-16' : ''}">
	<h3 class="flex items-center gap-2 text-lg font-semibold">
		{#if project_icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = project_icon}
			<span class="shrink-0 text-white/70 transition-colors group-hover:text-white">
				<Icon size={ICON_SIZE_LG} />
			</span>
		{/if}
		<span class={CARD_TITLE_CLASS}>
			{project.title}
		</span>
	</h3>
	{#if project.subtitle}
		<p class="mt-2 {CARD_DESCRIPTION_CLASS}">
			{project.subtitle}
		</p>
	{/if}
	<p class="mt-2 line-clamp-2 {CARD_DESCRIPTION_CLASS}">
		{project.description}
	</p>
</div>
