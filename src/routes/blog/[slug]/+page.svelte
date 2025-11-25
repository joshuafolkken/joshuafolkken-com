<script lang="ts">
	import { page } from '$app/state'
	import { external_links_action } from '$lib/actions/external-links'
	import { AUTHOR } from '$lib/app'
	import DateDisplay from '$lib/components/DateDisplay.svelte'
	import LikeContainer from '$lib/components/LikeContainer.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import SupportBox from '$lib/components/SupportBox.svelte'
	import { PAGES } from '$lib/types/page'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
	const image_url = `https://joshuafolkken.com${data.meta.cover_image ?? ''}`
	const blog_title = data.meta.title
	const page_title = `${blog_title} - ${AUTHOR.NAME}`
</script>

<svelte:head>
	<title>{page_title}</title>
	<meta name="description" content={data.meta.excerpt} />

	<meta property="og:type" content="webpage" />
	<meta property="og:image" content={image_url} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={image_url} />
	<meta name="twitter:site" content="@{AUTHOR.X_USERNAME}" />
</svelte:head>

<PageLayout>
	<PageHeader page={PAGES.BLOG} />

	<article class="prose mt-6 mb-6 max-w-none prose-invert" use:external_links_action.external_links>
		<h1 class="mb-1">{blog_title}</h1>
		<DateDisplay date={data.meta.date} updated={data.meta.updated} />

		{#if data.meta.cover_image}
			<div class="-mx-4 overflow-hidden">
				<img src={data.meta.cover_image} alt={blog_title} class="mb-0 h-auto w-full" />
			</div>
		{/if}

		<data.content />
	</article>

	<SupportBox />

	<LikeContainer slug={page.params.slug ?? ''} title={blog_title} />
</PageLayout>
