<script lang="ts">
	import { page } from '$app/state'
	import { external_links_action } from '$lib/actions/external-links'
	import { AUTHOR } from '$lib/app'
	import Divider from '$lib/components/Divider.svelte'
	import LikeContainer from '$lib/components/LikeContainer.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import { PAGES } from '$lib/types/page'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()
</script>

<svelte:head>
	<title>{data.meta.title} - {AUTHOR.NAME}</title>
	<meta name="description" content={data.meta.excerpt} />
</svelte:head>

<PageLayout>
	<PageHeader page={PAGES.BLOG} />
	<Divider />

	<article class="prose max-w-none prose-invert" use:external_links_action.external_links>
		<h1 class="mb-1">{data.meta.title}</h1>
		<time class="mt-0 block text-right text-[0.75rem] text-white/50">{data.meta.date}</time>
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

		<Divider />

		<LikeContainer slug={page.params.slug ?? ''} class="my-8" />

		<h2>ありがとう！</h2>
		<p>
			最後までありがとうございます！皆さんの応援が次の記事や開発の大きな力になります。
			この記事や活動が気に入ったら「
			<a href={PAGES.DONATIONS.link} class="link-base">サポーターになる</a
			>」で応援をお願い致します！
		</p>
	</article>
</PageLayout>
