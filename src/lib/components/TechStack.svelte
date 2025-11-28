<script lang="ts">
	/* eslint-disable import/no-duplicates */
	import { intersection_observer } from '$lib/actions/intersection-observer'
	import { TECH_STACK } from '$lib/data/tech-stack'
	import { SvelteSet } from 'svelte/reactivity'
	import { fly } from 'svelte/transition'

	const ANIMATION_DURATION = 500

	const visible_indices = new SvelteSet<number>()
</script>

<section class="my-6">
	<h2 class="mb-4 text-2xl font-light tracking-tight">🛠️ Tech Stack</h2>
	<div class="space-y-6">
		{#each TECH_STACK as category, index (category.title)}
			<div
				use:intersection_observer.intersect={() => visible_indices.add(index)}
				class="min-h-[50px]"
			>
				{#if visible_indices.has(index)}
					<div in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: 100 }}>
						<h3 class="mb-2 text-xl font-medium">{category.title}</h3>
						<div class="flex flex-wrap gap-2">
							{#each category.badges as badge (badge.name)}
								<img src={badge.url} alt={badge.name} />
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
