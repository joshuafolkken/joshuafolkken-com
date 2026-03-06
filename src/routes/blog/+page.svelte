<script lang="ts">
	import { AUTHOR } from '$lib/app'
	import BlogList from '$lib/components/BlogList.svelte'
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

<PageLayout max_width="6xl">
	<PageHeader page={PAGES.BLOG} />

	<section class="my-6">
		<BlogList posts={data.posts} />
	</section>
</PageLayout>
