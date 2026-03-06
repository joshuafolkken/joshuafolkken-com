<script lang="ts">
	import { app, LINK_REL, LINK_TARGET } from '$lib/app'
	import { ICON_SIZE_SM } from '$lib/constants/layout'
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import type { Project, ProjectLink } from '$lib/types/project'
	import { project_utilities } from '$lib/utils/project-utilities'
	import ProjectCardContent from './ProjectCardContent.svelte'

	const { project } = $props<{
		project: Project
	}>()

	const CARD_BASE_CLASS =
		'group rounded-2xl border border-white/5 bg-slate-900/50 transition-all duration-300' +
		' hover:-translate-y-1 hover:border-white/10 hover:bg-slate-800/80'

	const demo_href = $derived(project_utilities.get_demo_href(project))
	const github_link = $derived(project.links.find((link: ProjectLink) => link.type === 'github'))
	const has_github_link = $derived(Boolean(github_link))
</script>

<div class="relative flex flex-col overflow-hidden {CARD_BASE_CLASS}">
	{#if demo_href}
		<a href={demo_href} target={LINK_TARGET} rel={LINK_REL} class="block flex flex-1 flex-col">
			<ProjectCardContent {project} {has_github_link} />
		</a>
	{:else}
		<div class="block flex flex-1 flex-col">
			<ProjectCardContent {project} {has_github_link} />
		</div>
	{/if}
	{#if github_link}
		<a
			href={github_link.href}
			target={LINK_TARGET}
			rel={LINK_REL}
			class="absolute right-6 bottom-6 z-10 flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 group-hover:text-white/80 hover:text-sky-400"
		>
			<GitHubIcon size={ICON_SIZE_SM} />
			{app.link_label('github')}
		</a>
	{/if}
</div>
