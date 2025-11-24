<script lang="ts">
	import { page } from '$app/state'
	import { external_links_action } from '$lib/actions/external-links'
	import { AUTHOR } from '$lib/app'
	import DateDisplay from '$lib/components/DateDisplay.svelte'
	import Divider from '$lib/components/Divider.svelte'
	import LikeContainer from '$lib/components/LikeContainer.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import SupportBox from '$lib/components/SupportBox.svelte'
	import { PAGES } from '$lib/types/page'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
	const image_url = `https://joshuafolkken.com${data.meta.cover_image ?? ''}`
</script>

<svelte:head>
	<title>{data.meta.title} - {AUTHOR.NAME}</title>
	<meta name="description" content={data.meta.excerpt} />

	<meta property="og:type" content="webpage" />
	<meta property="og:image" content={image_url} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={image_url} />
	<meta name="twitter:site" content="@{AUTHOR.X_USERNAME}" />
</svelte:head>

<PageLayout>
	<PageHeader page={PAGES.BLOG} />
	<Divider />

	<article class="prose max-w-none prose-invert" use:external_links_action.external_links>
		<h1 class="mb-1">{data.meta.title}</h1>
		<DateDisplay date={data.meta.date} updated={data.meta.updated} class="mt-0" />
		<Divider />

		{#if data.meta.cover_image}
			<img
				src={data.meta.cover_image}
				alt={data.meta.title}
				class="-mt-2 h-auto w-full rounded-lg"
			/>
		{/if}

		<div class="-mt-2">
			<data.content />
		</div>

		<SupportBox />
		<LikeContainer slug={page.params.slug ?? ''} />
	</article>
</PageLayout>
