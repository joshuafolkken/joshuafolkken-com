<script lang="ts">
	import type { CaseStudy } from '$lib/types/project'

	const { case_study }: { case_study: CaseStudy } = $props()
</script>

<p class="text-lg text-white/80">{case_study.overview}</p>
{#each case_study.sections as section (section.heading)}
	<h2>{section.heading}</h2>
	<p>{section.body}</p>
{/each}
