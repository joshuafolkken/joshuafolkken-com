<script lang="ts">
	import { resolve } from '$app/paths'
	import DateDisplay from '$lib/components/DateDisplay.svelte'
	import type { Post } from '$lib/types/blog'

	const { post }: { post: Post } = $props()
</script>

<li
	class="group overflow-hidden rounded-lg border border-slate-300/50 transition duration-300 hover:border-slate-300 hover:bg-slate-800/60 hover:text-white"
>
	<a href={resolve(`/blog/${post.slug}`)} class="block">
		{#if post.cover_image}
			<div class="overflow-hidden">
				<img
					src={post.cover_image}
					alt={post.title}
					class="h-48 w-full object-cover transition-transform duration-1000 group-hover:scale-120"
				/>
			</div>
		{/if}
		<div class="p-4">
			<h2 class="text-lg font-semibold">{post.title}</h2>
			<p class="my-2 text-sm leading-relaxed text-gray-400 group-hover:text-gray-300">
				{post.excerpt}
			</p>
			<DateDisplay
				date={post.date}
				updated={post.updated}
				class="text-gray-500 group-hover:text-gray-400"
			/>
		</div>
	</a>
</li>
