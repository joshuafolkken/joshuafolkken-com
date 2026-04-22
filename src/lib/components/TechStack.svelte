<script lang="ts">
	import LiftedTechPill from '$lib/components/LiftedTechPill.svelte'
	import RevealOnIntersect from '$lib/components/RevealOnIntersect.svelte'
	import SectionHeading from '$lib/components/SectionHeading.svelte'
	import { CARD_BASE_CLASS } from '$lib/constants/card-styles'
	import { TECH_STACK } from '$lib/data/tech-stack'
	import ToolIcon from '$lib/icons/ToolIcon.svelte'

	const SECTION_MIN_HEIGHT_PX = 50
</script>

<section class="my-16">
	<SectionHeading icon={ToolIcon} title="Tech Stack" class="mb-10" />

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
							<LiftedTechPill name={badge.name} logo={badge.logo} />
						{/each}
					</div>
				</div>
			</RevealOnIntersect>
		{/each}
	</div>
</section>
