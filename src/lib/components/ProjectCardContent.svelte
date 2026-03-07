<script module lang="ts">
	const TAG_COLORS = new Map<string, string>([
		['SvelteKit', '#ff3e00'],
		['TypeScript', '#3178c6'],
		['Better Auth', '#38bdf8'],
		['Drizzle', '#4ade80'],
		['Cloudflare Workers', '#f97316'],
		['Cloudflare D1', '#fb923c'],
		['Cloudflare KV', '#fdba74'],
		['Cloudflare R2', '#fcd34d'],
		['TailwindCSS', '#06b6d4'],
		['GDScript', '#7c3aed'],
		['GL Compatibility', '#10b981'],
		['Web Export', '#6366f1'],
		['WebSockets', '#22c55e'],
	])

	function tag_color(tag: string): string {
		if (/^Godot \d+\.\d+$/u.test(tag)) return '#478cbf'
		return TAG_COLORS.get(tag) ?? '#64748b'
	}
</script>

<script lang="ts">
	import CardImage from '$lib/components/CardImage.svelte'
	import { CARD_DESCRIPTION_CLASS, CARD_TITLE_CLASS } from '$lib/constants/card-styles'
	import { ICON_SIZE_LG } from '$lib/constants/layout'
	import type { Project } from '$lib/types/project'

	const { project, has_github_link = false } = $props<{
		project: Project
		has_github_link?: boolean
	}>()
</script>

{#if project.image}
	<CardImage src={project.image} alt={project.title} />
{/if}
<div class="flex flex-1 flex-col p-6 {has_github_link ? 'pb-16' : ''}">
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
	{#if project.tags?.length}
		<div class="mt-3 flex flex-wrap gap-x-1.5 gap-y-2">
			{#each project.tags as tag (tag)}
				{@const color = tag_color(tag)}
				<span
					class="rounded-full border px-3 py-1 font-mono text-xs"
					style:border-color="{color}40"
					style:color
					style:background-color="{color}10">{tag}</span
				>
			{/each}
		</div>
	{/if}
</div>
