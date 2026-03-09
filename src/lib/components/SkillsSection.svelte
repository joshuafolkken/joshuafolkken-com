<script lang="ts">
	import RevealOnIntersect from '$lib/components/RevealOnIntersect.svelte'
	import TechPill from '$lib/components/TechPill.svelte'
	import { TECH_PILL_LIFT_CLASS } from '$lib/constants/hover-styles'
	import { SKILLS } from '$lib/data/skills'
	import { tech_colors } from '$lib/data/tech-colors'
	import { SvelteSet } from 'svelte/reactivity'

	const revealed = new SvelteSet<string>()

	const SKILL_BAR_GLOW_BLUR_PX = 8
	const SKILL_BAR_GLOW_SPREAD_PX = 2
</script>

<section>
	<h2 class="mb-2 text-3xl font-bold tracking-tight text-white">Skills</h2>
	<p class="mb-10 text-white/50">Technical and beyond.</p>

	<div class="grid gap-x-8 gap-y-6 sm:grid-cols-2">
		{#each SKILLS as skill (skill.name)}
			{@const color = tech_colors.get(skill.name)}
			<RevealOnIntersect is_always_render on_visible={() => revealed.add(skill.name)}>
				<div class="mb-2 flex items-baseline justify-between">
					<div class="{TECH_PILL_LIFT_CLASS} inline-block">
						<TechPill name={skill.name} />
					</div>
					<span class="font-mono text-xs" style:color>{skill.percent}%</span>
				</div>
				<div class="h-1 rounded-full bg-white/5">
					<div
						class="skill-bar h-full rounded-full"
						style:width={revealed.has(skill.name) ? `${String(skill.percent)}%` : '0%'}
						style:background-color={color}
						style:box-shadow="0 0 {SKILL_BAR_GLOW_BLUR_PX}px {SKILL_BAR_GLOW_SPREAD_PX}px {color}50"
					></div>
				</div>
			</RevealOnIntersect>
		{/each}
	</div>
</section>

<style>
	.skill-bar {
		--skill-bar-transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
		--shimmer-width: 60%;
		--shimmer-start: -60%;
		--shimmer-end: 110%;
		--shimmer-duration: 3.5s;
		--shimmer-opacity: 0.55;
		position: relative;
		overflow: hidden;
		transition: width var(--skill-bar-transition);
	}

	.skill-bar::after {
		content: '';
		position: absolute;
		top: 0;
		left: var(--shimmer-start);
		width: var(--shimmer-width);
		height: 100%;
		background: linear-gradient(
			to right,
			transparent 0%,
			rgba(255, 255, 255, var(--shimmer-opacity)) 50%,
			transparent 100%
		);
		animation: shimmer var(--shimmer-duration) ease-in-out infinite;
	}

	@keyframes shimmer {
		0% {
			left: var(--shimmer-start);
		}
		35% {
			left: var(--shimmer-end);
		}
		100% {
			left: var(--shimmer-end);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skill-bar {
			transition: none;
		}

		.skill-bar::after {
			animation: none;
		}
	}
</style>
