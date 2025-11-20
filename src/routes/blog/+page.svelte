<script lang="ts">
	import { resolve } from '$app/paths'
	import { AUTHOR } from '$lib/app'
	import Divider from '$lib/components/Divider.svelte'
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
	<Divider />

	<div class="mb-3 text-xl font-medium text-white/90">Posts</div>

	<ul class="space-y-4">
		{#each data.posts as post (post.slug)}
			<li
				class="group overflow-hidden rounded-lg border border-slate-300/50 transition duration-300 hover:border-slate-300 hover:bg-slate-800/60 hover:text-white"
			>
				<a href={resolve(`/blog/${post.slug}`)} class="block">
					{#if post.cover_image}
						<div class="overflow-hidden">
							<img
								src={post.cover_image}
								alt={post.title}
								class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
					{/if}
					<div class="p-4">
						<h2 class="text-lg font-semibold">{post.title}</h2>
						<p class="my-2 text-sm leading-relaxed text-gray-400 group-hover:text-gray-300">
							{post.excerpt}
						</p>
						<p class="text-right text-xs text-gray-500 group-hover:text-gray-400">{post.date}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</PageLayout>
