<script lang="ts">
	import { APP, app } from '$lib/app'
	import AdSenseScript from '$lib/components/AdSenseScript.svelte'
	import BlogList from '$lib/components/BlogList.svelte'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import { PAGES } from '$lib/types/page'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
	const blog_title = app.page_title(PAGES.BLOG.title)
</script>

<svelte:head>
	<title>{blog_title}</title>
	<meta name="description" content={PAGES.BLOG.description} />
</svelte:head>

<MetaTags title={blog_title} description={PAGES.BLOG.description} url="{APP.URL}/blog" />

<AdSenseScript />

<PageLayout max_width="6xl">
	<PageHeader page={PAGES.BLOG} />

	<section class="my-6">
		<BlogList posts={data.posts} />
	</section>
</PageLayout>
