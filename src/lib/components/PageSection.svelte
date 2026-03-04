<script lang="ts">
	import type { Snippet } from 'svelte'

	const {
		title,
		class: class_name,
		is_card = false,
		children,
	} = $props<{
		title?: string | undefined
		class?: string | undefined
		is_card?: boolean
		children: Snippet
	}>()
</script>

<section
	class="my-6 {is_card
		? 'rounded-xl border border-slate-600/50 bg-slate-800/40 p-6'
		: ''} {class_name}"
>
	{#if title}
		<h2 class="mb-4 text-2xl font-light tracking-tight text-white/90">{title}</h2>
	{/if}
	{@render children()}
</section>
