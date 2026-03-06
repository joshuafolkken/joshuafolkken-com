<script lang="ts">
	import { ICON_SIZE_LG } from '$lib/constants/layout'
	import type { Project } from '$lib/types/project'

	const { project, has_github_link = false } = $props<{
		project: Project
		has_github_link?: boolean
	}>()

	const CARD_TITLE_CLASS = 'text-white/70 transition-colors duration-300 group-hover:text-white'
	const CARD_DESCRIPTION_CLASS =
		'text-sm text-white/50 transition-colors duration-300 group-hover:text-white/80'

	const project_icon = $derived(project.icon)
</script>

{#if project.image}
	<div class="relative aspect-video w-full overflow-hidden">
		<img
			src={project.image}
			alt={project.title}
			class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
		/>
		<div
			class="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-60"
		></div>
	</div>
{/if}
<div class="flex flex-1 flex-col p-6 {has_github_link ? 'pb-12' : ''}">
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
