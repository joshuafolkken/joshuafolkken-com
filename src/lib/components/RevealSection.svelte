<script lang="ts">
	import { intersection_observer } from '$lib/actions/intersection-observer'
	import type { Snippet } from 'svelte'

	const {
		class: class_name = '',
		py = 'py-12',
		children,
	}: {
		class?: string
		py?: 'py-10' | 'py-12' | 'py-14' | 'py-20'
		children: Snippet
	} = $props()

	let is_visible = $state(false)

	function on_intersect(): void {
		is_visible = true
	}
</script>

<section
	class:revealed={is_visible}
	class="reveal-on-scroll {py} transition-all duration-1000 {class_name}"
	use:intersection_observer.intersect={on_intersect}
>
	{@render children()}
</section>
