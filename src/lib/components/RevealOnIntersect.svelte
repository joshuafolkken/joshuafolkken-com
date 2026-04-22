<script lang="ts">
	import { intersection_observer } from '$lib/actions/intersection-observer'
	import {
		ANIMATION_DELAY_MS,
		ANIMATION_DURATION_MS,
		FLY_OFFSET_Y_PX,
	} from '$lib/constants/animation'
	import type { Snippet } from 'svelte'
	import { fly } from 'svelte/transition'

	const {
		class: class_name = '',
		on_visible,
		min_height,
		children,
		is_fly_transition = false,
		is_always_render = false,
	}: {
		class?: string
		on_visible?: () => void
		min_height?: string
		children: Snippet
		is_fly_transition?: boolean
		/** When true, always render children and only call on_visible when intersected (e.g. for bar animations) */
		is_always_render?: boolean
	} = $props()

	let is_visible = $state(false)

	function handle_intersect(): void {
		if (is_visible) return

		is_visible = true
		on_visible?.()
	}
</script>

<div
	class={class_name}
	use:intersection_observer.intersect={handle_intersect}
	style:min-height={min_height}
>
	{#if is_always_render || is_visible}
		{#if is_fly_transition && is_visible}
			<div
				class="h-full"
				in:fly={{
					y: FLY_OFFSET_Y_PX,
					duration: ANIMATION_DURATION_MS,
					delay: ANIMATION_DELAY_MS,
				}}
			>
				{@render children()}
			</div>
		{:else}
			{@render children()}
		{/if}
	{/if}
</div>
