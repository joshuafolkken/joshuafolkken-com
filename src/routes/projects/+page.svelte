<script lang="ts">
	import { APP, AUTHOR } from '$lib/app'
	import EngagementButtons from '$lib/components/EngagementButtons.svelte'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import ProjectList from '$lib/components/ProjectList.svelte'
	import SupportBox from '$lib/components/SupportBox.svelte'
	import { PROJECTS } from '$lib/data/projects'
	import { PAGES } from '$lib/types/page'

	const title = `${PAGES.PROJECTS.title} - ${AUTHOR.NAME}`
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={PAGES.PROJECTS.description} />
</svelte:head>

<MetaTags {title} description={PAGES.PROJECTS.description} url="{APP.URL}/projects" />

<PageLayout max_width="6xl">
	<PageHeader page={PAGES.PROJECTS} />

	<section class="my-6">
		<ProjectList projects={PROJECTS} />
	</section>

	<SupportBox />
	<EngagementButtons slug="page:projects" {title} />
</PageLayout>
