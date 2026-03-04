<script lang="ts">
	import { reveal_on_scroll_action } from '$lib/actions/reveal-on-scroll'
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
</script>

<section
	class="reveal-on-scroll {py} transition-all duration-1000 {class_name}"
	use:reveal_on_scroll_action.reveal_on_scroll
>
	{@render children()}
</section>
