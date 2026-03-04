<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import RevealSection from '$lib/components/RevealSection.svelte'
	import { PROJECTS } from '$lib/data/projects'
	import { PAGES } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'
	import { project_utilities } from '$lib/utils/project-utilities'

	const FEATURED_COUNT = 4
	const QUICK_NAV_PAGES = [PAGES.PROJECTS, PAGES.BLOG, PAGES.PROFILE] as const
	const featured_projects = $derived(PROJECTS.filter((proj) => proj.image).slice(0, FEATURED_COUNT))
</script>

<HeroSection />

<PageLayout max_width="4xl">
	<div id="main-content" class="scroll-mt-20"></div>

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

		<div class="grid gap-8 sm:grid-cols-2">
			{#each featured_projects as project (project.title)}
				<a
					href={project_utilities.get_primary_href(project)}
					target={LINK_TARGET}
					rel={LINK_REL}
					class="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-slate-800/80"
				>
					{#if project.image}
						<div class="aspect-video w-full overflow-hidden">
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
					<div class="p-6">
						<h3 class="text-lg font-semibold text-white transition-colors group-hover:text-sky-400">
							{project.title}
						</h3>
						<p class="mt-2 line-clamp-2 text-sm text-white/50">
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
		<div class="grid gap-6 sm:grid-cols-3">
			{#each QUICK_NAV_PAGES as p (p.title)}
				<a
					href={link_utilities.get_href(p.link) ?? '#'}
					class="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-950/40 p-10 text-center transition-all hover:bg-white/5"
				>
					{#if p.icon}
						<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
						{@const NavIcon = p.icon}
						<div
							class="mb-6 rounded-2xl bg-white/5 p-4 text-white/40 transition-all group-hover:scale-110 group-hover:bg-sky-500/10 group-hover:text-sky-400"
						>
							<NavIcon size="2.5rem" />
						</div>
					{/if}
					<h3 class="text-xl font-semibold text-white">{p.title}</h3>
					<p class="mt-3 text-sm text-white/50">{p.description}</p>
				</a>
			{/each}
		</div>
	</RevealSection>
</PageLayout>
