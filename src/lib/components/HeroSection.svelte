<script lang="ts">
	import { APP, AUTHOR } from '$lib/app'
	import LogoWithGlow from '$lib/components/LogoWithGlow.svelte'
	import {
		HERO_CTA_BASE_CLASS,
		HERO_CTA_PRIMARY_CLASS,
		HERO_CTA_SECONDARY_CLASS,
		HERO_MIN_HEIGHT_CAP_PX,
	} from '$lib/constants/hero-constants'
	import { MAIN_CONTENT_ID } from '$lib/constants/layout'
	import { static_images } from '$lib/data/static-images'
	import { PAGES } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'

	const main_content_href = `#${MAIN_CONTENT_ID}`
</script>

<svelte:head>
	<link rel="preload" as="image" href={static_images.hero_bg} fetchpriority="high" />
</svelte:head>

<!-- Hero: full width, extends under sticky header -->
<header
	class="relative -mt-16 flex w-full flex-col items-center justify-center overflow-hidden"
	style:min-height={`min(100vh, ${String(HERO_MIN_HEIGHT_CAP_PX)}px)`}
	id="hero"
>
	<!-- Modern Background Layer -->
	<div class="absolute inset-0 bg-slate-950">
		<img
			src={static_images.hero_bg}
			alt=""
			class="hero-animate-image-slow h-full w-full object-cover opacity-40 mix-blend-screen"
			role="presentation"
		/>
		<!-- Animated Aurora/Glow Effects -->
		<div class="hero-aurora hero-aurora-1"></div>
		<div class="hero-aurora hero-aurora-2"></div>
		<div class="hero-aurora hero-aurora-3"></div>
	</div>

	<div class="relative z-10 flex flex-col items-center justify-center px-4 text-center">
		<div class="cyber-glow-hover group mb-8 scale-110 cursor-default">
			<LogoWithGlow />
		</div>
		<h1
			class="hero-animate-title font-display text-5xl font-bold tracking-tight text-white md:text-7xl"
		>
			{AUTHOR.NAME}
		</h1>
		<p class="hero-animate-desc mt-6 max-w-lg text-lg leading-relaxed text-white/60 md:text-xl">
			{APP.DESCRIPTION}
		</p>

		<div class="hero-animate-btns mt-10 flex gap-4">
			<a href={main_content_href} class="{HERO_CTA_BASE_CLASS} {HERO_CTA_PRIMARY_CLASS}">
				Explore Work
			</a>
			<a
				href={link_utilities.get_href(PAGES.ABOUT.link) ?? '#'}
				class="{HERO_CTA_BASE_CLASS} {HERO_CTA_SECONDARY_CLASS}"
			>
				About Me
			</a>
		</div>
	</div>

	<a href={main_content_href} class="hero-scroll-prompt" aria-label="Scroll to content">
		<div class="flex flex-col items-center gap-2">
			<span class="text-[10px] tracking-[0.3em] text-white/40 uppercase">Scroll</span>
			<div class="h-12 w-px bg-linear-to-b from-white/40 to-transparent"></div>
		</div>
	</a>
</header>

<style>
	@import './hero-section.css';
</style>
