<script lang="ts">
	import { AUTHOR } from '$lib/app'
	import BlogCard from '$lib/components/BlogCard.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import { PAGES } from '$lib/types/page'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
</script>

<svelte:head>
	<title>{PAGES.BLOG.title} - {AUTHOR.NAME}</title>
	<meta name="description" content={PAGES.BLOG.description} />
</svelte:head>

<PageLayout>
	<PageHeader page={PAGES.BLOG} />

	<section class="my-6">
		<!-- <div class="mb-4 text-2xl font-light tracking-tight text-white/90">Posts</div> -->

		<ul class="space-y-4">
			{#each data.posts as post (post.slug)}
				<BlogCard {post} />
			{/each}
		</ul>
	</section>
</PageLayout>
