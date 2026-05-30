<script lang="ts">
	import { external_links } from '$lib/actions/external-links'
	import { APP, AUTHOR } from '$lib/app'
	import CardImage from '$lib/components/CardImage.svelte'
	import EngagementButtons from '$lib/components/EngagementButtons.svelte'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import ProjectCardLinkButton from '$lib/components/ProjectCardLinkButton.svelte'
	import ProjectCardTags from '$lib/components/ProjectCardTags.svelte'
	import ProjectCaseStudy from '$lib/components/ProjectCaseStudy.svelte'
	import SupportBox from '$lib/components/SupportBox.svelte'
	import { ICON_SIZE_XL } from '$lib/constants/layout'
	import { PAGES } from '$lib/types/page'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
	const project = $derived(data.project)
	const case_study = $derived(data.case_study)
	const page_title = $derived(`${project.title} - ${AUTHOR.NAME}`)
	const description = $derived(case_study?.overview ?? project.description)
	const detail_url = $derived(`${APP.URL}/projects/${data.slug}`)
	const image_url = $derived(project.image ? `${APP.URL}${project.image}` : undefined)
	// eslint-disable-next-line @typescript-eslint/naming-convention -- Svelte components must be PascalCase to render
	const Icon = $derived(project.icon)
</script>

<svelte:head>
	<title>{page_title}</title>
	<meta name="description" content={description} />
</svelte:head>

<MetaTags title={page_title} {description} url={detail_url} type="article" image={image_url} />

<PageLayout>
	<PageHeader page={PAGES.PROJECTS} />

	<article class="prose mt-6 mb-6 max-w-none prose-invert" use:external_links>
		<h1 class="mb-3 flex items-center gap-2">
			<Icon size={ICON_SIZE_XL} />
			{project.title}
		</h1>
		{#if project.subtitle}
			<p class="mt-0 text-white/60 not-prose">{project.subtitle}</p>
		{/if}

		{#if project.image}
			<div class="-mx-4 overflow-hidden rounded-xl">
				<CardImage src={project.image} alt={project.title} />
			</div>
		{/if}

		{#if case_study}
			<ProjectCaseStudy {case_study} />
		{/if}
	</article>

	<ProjectCardTags tags={project.tags ?? []} />

	<div class="mt-6 flex flex-wrap items-center gap-6">
		{#each project.links as link (link.href)}
			<ProjectCardLinkButton {link} />
		{/each}
	</div>

	<SupportBox />

	<EngagementButtons slug="project:{data.slug}" title={project.title} />
</PageLayout>
