<script lang="ts">
	import { intersection_observer } from '$lib/actions/intersection-observer'
	import TechPill from '$lib/components/TechPill.svelte'
	import { tech_colors, type TechColorKey } from '$lib/data/tech-colors'
	import { SvelteSet } from 'svelte/reactivity'

	const SKILLS = [
		{ name: 'Teaching & Mentoring', percent: 85 },
		{ name: 'SvelteKit', percent: 85 },
		{ name: 'TypeScript', percent: 85 },
		{ name: 'Cloudflare Workers / D1 / KV / R2', percent: 80 },
		{ name: 'UI / UX Design', percent: 80 },
		{ name: 'Godot / GDScript', percent: 80 },
		{ name: 'Tailwind CSS', percent: 80 },
		{ name: 'Drizzle ORM', percent: 70 },
		{ name: 'WebSocket', percent: 70 },
		{ name: 'Community Building', percent: 60 },
		{ name: 'Rust', percent: 50 },
		{ name: 'Game Design', percent: 30 },
	] satisfies Array<{ name: TechColorKey; percent: number }>

	const revealed = new SvelteSet<number>()
</script>

<section>
	<h2 class="mb-2 text-3xl font-bold tracking-tight text-white">Skills</h2>
	<p class="mb-10 text-white/50">Technical and beyond.</p>

	<div class="grid gap-x-8 gap-y-6 sm:grid-cols-2">
		{#each SKILLS as skill, index (skill.name)}
			{@const color = tech_colors.get(skill.name)}
			<div use:intersection_observer.intersect={() => revealed.add(index)}>
				<div class="mb-2 flex items-baseline justify-between">
					<TechPill name={skill.name} />
					<span class="font-mono text-xs" style:color>{skill.percent}%</span>
				</div>
				<div class="h-1 rounded-full bg-white/5">
					<div
						class="skill-bar h-full rounded-full"
						style:width={revealed.has(index) ? `${String(skill.percent)}%` : '0%'}
						style:background-color={color}
						style:box-shadow="0 0 8px 2px {color}50"
					></div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	.skill-bar {
		position: relative;
		overflow: hidden;
		transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.skill-bar::after {
		content: '';
		position: absolute;
		top: 0;
		left: -60%;
		width: 60%;
		height: 100%;
		background: linear-gradient(
			to right,
			transparent 0%,
			rgba(255, 255, 255, 0.55) 50%,
			transparent 100%
		);
		animation: shimmer 3.5s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% {
			left: -60%;
		}
		35% {
			left: 110%;
		}
		100% {
			left: 110%;
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
