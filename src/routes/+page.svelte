<script lang="ts">
	import { APP, AUTHOR, LINK_REL, LINK_TARGET } from '$lib/app'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import { PROJECTS } from '$lib/data/projects'
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import { PAGES } from '$lib/types/page'

	const FEATURED_COUNT = 4
	const featured_projects = $derived(PROJECTS.filter((proj) => proj.image).slice(0, FEATURED_COUNT))
</script>

<!-- Hero: full width, extends under sticky header -->
<header
	class="relative -mt-16 flex min-h-[min(100vh,1920px)] w-full flex-col items-center justify-center overflow-hidden text-center"
	id="hero"
>
	<img
		src="/images/header-banner.webp"
		alt=""
		class="absolute inset-0 h-full w-full object-cover"
		role="presentation"
	/>
	<div class="absolute inset-0 bg-slate-900/60" aria-hidden="true"></div>
	<div class="relative z-10 flex flex-col items-center justify-center px-4">
		<div class="my-4">
			<LogoIcon />
		</div>
		<h1 class="text-4xl font-light tracking-tight text-white/95">{AUTHOR.NAME}</h1>
		<p class="mt-3 text-lg text-white/80 italic">{APP.DESCRIPTION}</p>
	</div>
	<a href="#main-content" class="scroll-prompt" aria-label="Scroll to content">
		<span class="scroll-text">SCROLL</span>
		<div class="chevron"></div>
	</a>
</header>

<PageLayout max_width="4xl">
	<div id="main-content" class="scroll-mt-20"></div>
	<!-- Featured Projects -->
	<section class="mt-4 mb-12">
		<h2 class="mb-6 text-2xl font-light tracking-tight text-white/90">Featured Projects</h2>
		<div class="grid gap-6 sm:grid-cols-2">
			{#each featured_projects as project (project.title)}
				<a
					href={project.links.find((link) => link.type === 'demo')?.href ??
						project.links[0]?.href ??
						'#'}
					target={LINK_TARGET}
					rel={LINK_REL}
					class="group overflow-hidden rounded-xl border border-slate-600/50 bg-slate-800/50 transition duration-300 hover:border-slate-500 hover:bg-slate-700/60"
				>
					{#if project.image}
						<div class="aspect-video overflow-hidden">
							<img
								src={project.image}
								alt={project.title}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					{/if}
					<div class="p-4">
						<h3 class="font-medium text-white/80 transition duration-300 group-hover:text-white">
							{project.title}
						</h3>
						<p class="mt-1 text-sm text-white/60">{project.subtitle}</p>
					</div>
				</a>
			{/each}
		</div>
		<a
			href="/projects"
			class="mt-6 inline-block text-white/80 underline-offset-4 transition hover:text-white"
		>
			View all projects →
		</a>
	</section>

	<!-- Quick Links -->
	<section class="mb-8">
		<h2 class="mb-6 text-2xl font-light tracking-tight text-white/90">Explore</h2>
		<div class="grid gap-4 sm:grid-cols-3">
			<a
				href="/projects"
				class="group flex items-center gap-3 rounded-xl border border-slate-600/50 bg-slate-800/50 p-4 transition duration-300 hover:border-slate-500 hover:bg-slate-700/60"
			>
				{#if PAGES.PROJECTS.icon}
					<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
					{@const ProjectsIcon = PAGES.PROJECTS.icon}
					<span class="shrink-0 opacity-80 transition duration-300 group-hover:opacity-100">
						<ProjectsIcon size="2rem" />
					</span>
				{/if}
				<div>
					<h3 class="font-medium text-white/80 transition duration-300 group-hover:text-white">
						{PAGES.PROJECTS.title}
					</h3>
					<p class="text-sm text-white/60">{PAGES.PROJECTS.description}</p>
				</div>
			</a>
			<a
				href="/blog"
				class="group flex items-center gap-3 rounded-xl border border-slate-600/50 bg-slate-800/50 p-4 transition duration-300 hover:border-slate-500 hover:bg-slate-700/60"
			>
				{#if PAGES.BLOG.icon}
					<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
					{@const BlogIcon = PAGES.BLOG.icon}
					<span class="shrink-0 opacity-80 transition duration-300 group-hover:opacity-100">
						<BlogIcon size="2rem" />
					</span>
				{/if}
				<div>
					<h3 class="font-medium text-white/80 transition duration-300 group-hover:text-white">
						{PAGES.BLOG.title}
					</h3>
					<p class="text-sm text-white/60">{PAGES.BLOG.description}</p>
				</div>
			</a>
			<a
				href="/profile"
				class="group flex items-center gap-3 rounded-xl border border-slate-600/50 bg-slate-800/50 p-4 transition duration-300 hover:border-slate-500 hover:bg-slate-700/60"
			>
				{#if PAGES.PROFILE.icon}
					<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
					{@const UserIcon = PAGES.PROFILE.icon}
					<span class="shrink-0 opacity-80 transition duration-300 group-hover:opacity-100">
						<UserIcon size="2rem" />
					</span>
				{/if}
				<div>
					<h3 class="font-medium text-white/80 transition duration-300 group-hover:text-white">
						{PAGES.PROFILE.title}
					</h3>
					<p class="text-sm text-white/60">{PAGES.PROFILE.description}</p>
				</div>
			</a>
		</div>
	</section>
</PageLayout>

<style>
	.scroll-prompt {
		position: absolute;
		z-index: 20;
		bottom: 2rem;
		left: 50%;
		transform: translate(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		color: rgb(255 255 255 / 0.98);
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		cursor: pointer;
		transition: color 0.2s;
	}
	.scroll-prompt:hover {
		color: white;
	}
	.chevron {
		width: 20px;
		height: 20px;
		border-bottom: 2px solid white;
		border-right: 2px solid white;
		transform: rotate(45deg);
		margin-top: 0.5rem;
		animation: scroll-chevron-float 3s ease-in-out infinite;
	}
	@keyframes scroll-chevron-float {
		0%,
		100% {
			transform: translateY(0) rotate(45deg);
		}
		50% {
			transform: translateY(8px) rotate(45deg);
		}
	}
</style>
