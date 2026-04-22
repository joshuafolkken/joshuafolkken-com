<script lang="ts">
	import CardImage from '$lib/components/CardImage.svelte'
	import { CARD_DESCRIPTION_CLASS, CARD_TITLE_CLASS } from '$lib/constants/card-styles'
	import { ICON_SIZE_LG } from '$lib/constants/layout'
	import type { Project } from '$lib/types/project'
	import { get_card_body_padding } from '$lib/utils/project-card-layout'
	import ProjectCardTags from './ProjectCardTags.svelte'

	const {
		project,
		has_secondary_link = false,
		should_include_tags = true,
	} = $props<{
		project: Project
		has_secondary_link?: boolean
		/** When false (demo link wraps the body), tags render outside the `<a>` in `ProjectCard`. */
		should_include_tags?: boolean
	}>()

	const has_tag_list = $derived(Boolean(project.tags?.length))

	const body_bottom_class = $derived(
		get_card_body_padding(should_include_tags, has_secondary_link, has_tag_list),
	)
</script>

{#if project.image}
	<CardImage src={project.image} alt={project.title} />
{/if}
<div class="flex flex-1 flex-col p-6 {body_bottom_class}">
	<h3 class="flex items-center gap-2 text-lg font-semibold">
		{#if project.icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = project.icon}
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
	<p class="mt-2 {CARD_DESCRIPTION_CLASS}">
		{project.description}
	</p>
	{#if should_include_tags}
		<ProjectCardTags tags={project.tags ?? []} />
	{/if}
</div>
