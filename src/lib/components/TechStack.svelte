<script lang="ts">
	import RevealOnIntersect from '$lib/components/RevealOnIntersect.svelte'
	import TechPill from '$lib/components/TechPill.svelte'
	import { CARD_BASE_CLASS } from '$lib/constants/card-styles'
	import { TECH_PILL_LIFT_CLASS } from '$lib/constants/hover-styles'
	import { SECTION_HEADING_LIGHT_LG_CLASS } from '$lib/constants/typography'
	import { TECH_STACK } from '$lib/data/tech-stack'
	import ToolIcon from '$lib/icons/ToolIcon.svelte'

	const SECTION_MIN_HEIGHT_PX = 50
	const SECTION_ICON_SIZE = '1.25rem'
	const SECTION_ICON_WRAPPER_CLASS =
		'flex items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 p-2 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)] ring-1 ring-sky-400/20 ring-inset'
</script>

<section class="my-16">
	<div class="mb-10 flex items-center gap-3">
		<div class={SECTION_ICON_WRAPPER_CLASS}>
			<ToolIcon size={SECTION_ICON_SIZE} />
		</div>
		<h2 class={SECTION_HEADING_LIGHT_LG_CLASS}>Tech Stack</h2>
	</div>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each TECH_STACK as category (category.title)}
			<RevealOnIntersect class="h-full" min_height="{SECTION_MIN_HEIGHT_PX}px" is_fly_transition>
				<div class="{CARD_BASE_CLASS} group flex h-full flex-col p-6 transition-all duration-500">
					<h3
						class="mb-5 border-b border-white/5 pb-3 text-xs font-semibold tracking-widest text-sky-400/80 uppercase transition-colors duration-300 group-hover:border-sky-400/30 group-hover:text-sky-400"
					>
						{category.title}
					</h3>
					<div class="flex flex-wrap gap-2.5">
						{#each category.badges as badge (badge.name)}
							<div class={TECH_PILL_LIFT_CLASS}>
								<TechPill name={badge.name} logo={badge.logo} />
							</div>
						{/each}
					</div>
				</div>
			</RevealOnIntersect>
		{/each}
	</div>
</section>
