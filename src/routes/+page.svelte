<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import CardImage from '$lib/components/CardImage.svelte'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import RevealSection from '$lib/components/RevealSection.svelte'
	import {
		CARD_BASE_CLASS,
		CARD_DESCRIPTION_CLASS,
		CARD_TITLE_CLASS,
		CARD_WRAPPER_CLASS,
	} from '$lib/constants/card-styles'
	import { ICON_SIZE_2XL, MAIN_CONTENT_ID } from '$lib/constants/layout'
	import { FEATURED_PROJECT_COUNT, PROJECTS } from '$lib/data/projects'
	import { MAIN_NAV_PAGES, PAGES } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'
	import { project_utilities } from '$lib/utils/project-utilities'

	const featured_projects = $derived(
		PROJECTS.filter((proj) => proj.image).slice(0, FEATURED_PROJECT_COUNT),
	)
</script>

<HeroSection />

<PageLayout max_width="6xl">
	<div id={MAIN_CONTENT_ID} class="scroll-mt-20"></div>

	<!-- Featured Projects -->
	<RevealSection>
		<div class="mb-12 flex items-end justify-between">
			<div>
				<h2 class="text-3xl font-bold tracking-tight text-white">Featured Projects</h2>
				<p class="mt-2 text-white/50">A selection of my recent work and experiments.</p>
			</div>
			<a
				href={link_utilities.get_href(PAGES.PROJECTS.link)}
				class="group text-sm font-medium text-sky-400 decoration-sky-400/30 transition hover:text-sky-300 hover:underline"
			>
				View Gallery <span class="inline-block transition-transform group-hover:translate-x-1"
					>→</span
				>
			</a>
		</div>

		<div class="grid gap-8 lg:grid-cols-2">
			{#each featured_projects as project (project.title)}
				<a
					href={project_utilities.get_primary_href(project)}
					target={LINK_TARGET}
					rel={LINK_REL}
					class={CARD_WRAPPER_CLASS}
				>
					{#if project.image}
						<CardImage src={project.image} alt={project.title} />
					{/if}
					<div class="p-6">
						<h3 class="text-lg font-semibold">
							<span class={CARD_TITLE_CLASS}>
								{project.title}
							</span>
						</h3>
						<p class="mt-2 line-clamp-2 {CARD_DESCRIPTION_CLASS}">
							{project.subtitle}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</RevealSection>

	<!-- Quick Navigation -->
	<RevealSection>
		<h2 class="mb-12 text-center text-3xl font-bold tracking-tight text-white">Discover</h2>
		<div class="grid gap-6 lg:grid-cols-3">
			{#each MAIN_NAV_PAGES as p (p.title)}
				<a
					href={link_utilities.get_href(p.link) ?? '#'}
					class="flex flex-col items-center justify-center p-10 text-center {CARD_BASE_CLASS}"
				>
					{#if p.icon}
						<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
						{@const NavIcon = p.icon}
						<div
							class="mb-6 rounded-2xl bg-white/5 p-4 text-white/40 transition-all group-hover:scale-110 group-hover:bg-sky-500/10 group-hover:text-sky-400"
						>
							<NavIcon size={ICON_SIZE_2XL} />
						</div>
					{/if}
					<h3 class="text-xl font-semibold">
						<span class={CARD_TITLE_CLASS}>
							{p.title}
						</span>
					</h3>
					<p class="mt-3 {CARD_DESCRIPTION_CLASS}">
						{p.description}
					</p>
				</a>
			{/each}
		</div>
	</RevealSection>
</PageLayout>
