<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import {
		CARD_WRAPPER_CLASS,
		PROJECT_CARD_COLUMN_CLASS,
		PROJECT_CARD_LINKS_ROW_CLASS,
	} from '$lib/constants/card-styles'
	import type { Project } from '$lib/types/project'
	import { get_demo_tag_row_class } from '$lib/utils/project-card-layout'
	import { project_utilities } from '$lib/utils/project-utilities'
	import ProjectCardContent from './ProjectCardContent.svelte'
	import ProjectCardLinkButton from './ProjectCardLinkButton.svelte'
	import ProjectCardTags from './ProjectCardTags.svelte'

	const { project } = $props<{
		project: Project
	}>()

	const demo_href = $derived(project_utilities.get_demo_href(project))
	const secondary_links = $derived(project_utilities.get_secondary_links(project))
	const has_secondary_link = $derived(secondary_links.length > 0)
</script>

<div class={CARD_WRAPPER_CLASS}>
	{#if demo_href}
		<div class={PROJECT_CARD_COLUMN_CLASS}>
			<a href={demo_href} target={LINK_TARGET} rel={LINK_REL} class={PROJECT_CARD_COLUMN_CLASS}>
				<ProjectCardContent {project} {has_secondary_link} should_include_tags={false} />
			</a>
			<ProjectCardTags
				tags={project.tags ?? []}
				class={get_demo_tag_row_class(has_secondary_link)}
			/>
		</div>
	{:else}
		<div class={PROJECT_CARD_COLUMN_CLASS}>
			<ProjectCardContent {project} {has_secondary_link} />
		</div>
	{/if}
	{#if has_secondary_link}
		<div class={PROJECT_CARD_LINKS_ROW_CLASS}>
			{#each secondary_links as link (link.type)}
				<ProjectCardLinkButton {link} />
			{/each}
		</div>
	{/if}
</div>
