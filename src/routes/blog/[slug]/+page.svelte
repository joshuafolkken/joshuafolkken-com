<script lang="ts">
	import { external_links } from '$lib/actions/external-links'
	import { APP, AUTHOR } from '$lib/app'
	import AdSenseScript from '$lib/components/AdSenseScript.svelte'
	import DateDisplay from '$lib/components/DateDisplay.svelte'
	import EngagementButtons from '$lib/components/EngagementButtons.svelte'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import SupportBox from '$lib/components/SupportBox.svelte'
	import { blog_images } from '$lib/data/blog-images'
	import { PAGES } from '$lib/types/page'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
	const cover_image_source = $derived(blog_images.get_cover_image_url(data.meta.cover_image))
	const image_url = $derived(cover_image_source ? `${APP.URL}${cover_image_source}` : '')
	const blog_title = $derived(data.meta.title)
	const page_title = $derived(`${blog_title} - ${AUTHOR.NAME}`)
</script>

<svelte:head>
	<title>{page_title}</title>
	<meta name="description" content={data.meta.excerpt} />
	{#if !data.should_index}
		<meta name="robots" content="noindex, follow" />
	{/if}
</svelte:head>

<MetaTags
	title={page_title}
	description={data.meta.excerpt}
	url="{APP.URL}/blog/{data.slug}"
	type="article"
	image={image_url || undefined}
/>

{#if data.should_show_ads}
	<AdSenseScript />
{/if}

<PageLayout>
	<PageHeader page={PAGES.BLOG} />

	<article class="prose mt-6 mb-6 max-w-none prose-invert" use:external_links>
		<h1 class="mb-3">{blog_title}</h1>
		<DateDisplay date={data.meta.date} updated={data.meta.updated} author={data.meta.author} />

		{#if cover_image_source}
			<div class="-mx-4 overflow-hidden">
				<img src={cover_image_source} alt={blog_title} class="mb-0 h-auto w-full" loading="lazy" />
			</div>
		{/if}

		<data.content />
	</article>

	<SupportBox />

	<EngagementButtons slug={data.slug} title={blog_title} />
</PageLayout>
