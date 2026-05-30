<script lang="ts">
	import BlogIcon from '$lib/icons/BlogIcon.svelte'
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import LiveDemoIcon from '$lib/icons/LiveDemoIcon.svelte'
	import PackageIcon from '$lib/icons/PackageIcon.svelte'
	import type { ProjectLink } from '$lib/types/project'

	const { type, size } = $props<{
		type: ProjectLink['type']
		size: string
	}>()
</script>

{#if type === 'blog'}
	<BlogIcon {size} />
{:else if type === 'github'}
	<GitHubIcon {size} />
{:else if type === 'npm'}
	<PackageIcon {size} />
{:else if type === 'demo' || type === 'play'}
	<LiveDemoIcon {size} />
{/if}
