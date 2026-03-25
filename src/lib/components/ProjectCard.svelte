<script lang="ts">
	import { app, LINK_REL, LINK_TARGET } from '$lib/app'
	import {
		CARD_WRAPPER_CLASS,
		PROJECT_CARD_COLUMN_CLASS,
		PROJECT_CARD_GITHUB_LINK_CLASS,
	} from '$lib/constants/card-styles'
	import { ICON_SIZE_SM } from '$lib/constants/layout'
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import type { Project } from '$lib/types/project'
	import { get_demo_tag_row_class } from '$lib/utils/project-card-layout'
	import { project_utilities } from '$lib/utils/project-utilities'
	import ProjectCardContent from './ProjectCardContent.svelte'
	import ProjectCardTags from './ProjectCardTags.svelte'

	const { project } = $props<{
		project: Project
	}>()

	const demo_href = $derived(project_utilities.get_demo_href(project))
	const github_link = $derived(project_utilities.get_github_link(project))
	const has_github_link = $derived(Boolean(github_link))
</script>

<div class={CARD_WRAPPER_CLASS}>
	{#if demo_href}
		<div class={PROJECT_CARD_COLUMN_CLASS}>
			<a href={demo_href} target={LINK_TARGET} rel={LINK_REL} class={PROJECT_CARD_COLUMN_CLASS}>
				<ProjectCardContent {project} {has_github_link} should_include_tags={false} />
			</a>
			<ProjectCardTags tags={project.tags ?? []} class={get_demo_tag_row_class(has_github_link)} />
		</div>
	{:else}
		<div class={PROJECT_CARD_COLUMN_CLASS}>
			<ProjectCardContent {project} {has_github_link} />
		</div>
	{/if}
	{#if github_link}
		<a
			href={github_link.href}
			target={LINK_TARGET}
			rel={LINK_REL}
			class={PROJECT_CARD_GITHUB_LINK_CLASS}
		>
			<GitHubIcon size={ICON_SIZE_SM} />
			{app.link_label('github')}
		</a>
	{/if}
</div>
