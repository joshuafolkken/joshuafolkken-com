<script lang="ts">
	import { page } from '$app/state'
	import { external_links_action } from '$lib/actions/external-links'
	import { AUTHOR } from '$lib/app'
	import Divider from '$lib/components/Divider.svelte'
	import LikeButton from '$lib/components/LikeButton.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import { LikeState } from '$lib/hooks/UseLike.svelte'
	import { PAGES } from '$lib/types/page'
	import type { PageData } from './$types'

	const { data }: { data: PageData & { likes: number } } = $props()

	// slug が undefined の可能性を考慮して空文字を渡すが、
	// 通常は +page.ts で保証される
	const like_state = new LikeState((data.likes as number | undefined) ?? 0, page.params.slug ?? '')
</script>

<svelte:head>
	<title>{data.meta.title} - {AUTHOR.NAME}</title>
	<meta name="description" content={data.meta.excerpt} />
</svelte:head>

<PageLayout>
	<PageHeader page={PAGES.BLOG} />
	<Divider />

	<article class="prose prose-invert" use:external_links_action.external_links>
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

		<div class="my-8 flex justify-center">
			<LikeButton
				count={like_state.count}
				is_liked={like_state.is_liked}
				is_animating={like_state.is_animating}
				onclick={() => {
					void like_state.toggle()
				}}
			/>
		</div>

		<h2>ありがとう！</h2>
		<p>
			最後までありがとうございます！皆さんの応援が次の記事や開発の大きな力になります。
			この記事や活動が気に入ったら「
			<a href={PAGES.DONATIONS.link} class="link-base">サポーターになる</a
			>」で応援をお願い致します！
		</p>
	</article>
</PageLayout>
