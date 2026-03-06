<script lang="ts">
	import type { Post } from '$lib/types/blog'
	import BlogCard from './BlogCard.svelte'

	const { posts } = $props<{
		posts: Array<Post>
	}>()
</script>

<div class="grid gap-8 lg:grid-cols-2">
	{#each posts as post (post.slug)}
		<BlogCard {post} />
	{/each}
</div>
