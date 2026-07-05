<script lang="ts">
	import { resolve } from '$app/paths'
	import CardImage from '$lib/components/CardImage.svelte'
	import DateDisplay from '$lib/components/DateDisplay.svelte'
	import YouTubeThumbnail from '$lib/components/YouTubeThumbnail.svelte'
	import {
		CARD_DESCRIPTION_CLASS,
		CARD_TITLE_CLASS,
		CARD_WRAPPER_CLASS,
	} from '$lib/constants/card-styles'
	import { blog_images } from '$lib/data/blog-images'
	import type { Post } from '$lib/types/blog'

	const { post }: { post: Post } = $props()
	const cover_image_source = $derived(blog_images.get_cover_image_url(post.cover_image))
</script>

<div class={CARD_WRAPPER_CLASS}>
	<a href={resolve('/blog/[slug]', { slug: post.slug })} class="flex flex-1 flex-col">
		{#if cover_image_source}
			<CardImage src={cover_image_source} alt={post.title} />
		{:else if post.youtube}
			<YouTubeThumbnail />
		{/if}
		<div class="flex flex-1 flex-col p-6 pb-16">
			<h3 class="flex items-center gap-2 text-lg font-semibold">
				<span class={CARD_TITLE_CLASS}>
					{post.title}
				</span>
			</h3>
			<p class="mt-2 line-clamp-2 {CARD_DESCRIPTION_CLASS}">
				{post.excerpt}
			</p>
			<DateDisplay
				date={post.date}
				updated={post.updated}
				class="absolute right-6 bottom-6 text-white/40 transition-colors duration-300 group-hover:text-white/60"
			/>
		</div>
	</a>
</div>
