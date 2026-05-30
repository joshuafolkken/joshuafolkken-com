<script lang="ts">
	import CardImage from '$lib/components/CardImage.svelte'
	import { CARD_DESCRIPTION_CLASS, CARD_TITLE_CLASS } from '$lib/constants/card-styles'
	import { ICON_SIZE_LG } from '$lib/constants/layout'
	import type { Project } from '$lib/types/project'
	import type { Snippet } from 'svelte'
	import ProjectCardTags from './ProjectCardTags.svelte'

	const { project, header_actions } = $props<{
		project: Project
		/** Rendered at the right end of the title row (e.g. icon-only links). */
		header_actions?: Snippet
	}>()
</script>

{#if project.image}
	<CardImage src={project.image} alt={project.title} />
{/if}
<div class="flex flex-1 flex-col p-6">
	<div class="flex items-start gap-2">
		{#if project.icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = project.icon}
			<span class="shrink-0 text-white/70 transition-colors group-hover:text-white">
				<Icon size={ICON_SIZE_LG} />
			</span>
		{/if}
		<h3 class="min-w-0 flex-1 text-lg font-semibold {CARD_TITLE_CLASS}">
			{project.title}
		</h3>
		{#if header_actions}
			<div class="relative z-20 flex shrink-0 items-center gap-3">
				{@render header_actions()}
			</div>
		{/if}
	</div>
	{#if project.subtitle}
		<p class="mt-2 {CARD_DESCRIPTION_CLASS}">
			{project.subtitle}
		</p>
	{/if}
	<p class="mt-2 {CARD_DESCRIPTION_CLASS}">
		{project.description}
	</p>
	<ProjectCardTags tags={project.tags ?? []} />
</div>
