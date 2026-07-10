<script lang="ts">
	import { external_links } from '$lib/actions/external-links'
	import DateDisplay from '$lib/components/DateDisplay.svelte'
	import EngagementButtons from '$lib/components/EngagementButtons.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import SupportBox from '$lib/components/SupportBox.svelte'
	import YouTubeEmbed from '$lib/components/YouTubeEmbed.svelte'
	import YouTubeTranscriptNotice from '$lib/components/YouTubeTranscriptNotice.svelte'
	import type { Component } from 'svelte'

	interface Props {
		url: string
		title: string
		slug: string
		author?: string | undefined
		date: string
		updated?: string | undefined
		youtube_date?: string | undefined
		content: Component
	}

	const {
		url,
		title,
		slug,
		author,
		date,
		updated,
		youtube_date,
		// eslint-disable-next-line @typescript-eslint/naming-convention -- Svelte renders a capitalized identifier as a component
		content: Content,
	}: Props = $props()
</script>

<PageLayout>
	<!-- Mobile: full-bleed video pinned under the fixed 4rem header; content scrolls past it. -->
	<div
		class="sticky top-16 z-20 -mx-4 -mt-8 bg-slate-950 lg:hidden"
		data-testid="talk-sticky-video"
	>
		<YouTubeEmbed {url} {title} />
	</div>

	<div class="mt-4 lg:grid lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-10">
		<aside class="lg:sticky lg:top-20 lg:self-start" data-testid="talk-meta">
			<!-- Desktop: the playable embed in the sidebar (the mobile copy above is the sticky one). -->
			<div class="hidden lg:block" data-testid="talk-sidebar-video">
				<YouTubeEmbed {url} {title} />
			</div>

			<h1 class="mt-4 text-2xl leading-snug font-light tracking-tight text-white">{title}</h1>

			<DateDisplay class="mt-3" align="sidebar" {date} {updated} {author} {youtube_date} />

			<div class="mt-4 rounded-xl border border-sky-400/20 bg-sky-500/5 p-4">
				<YouTubeTranscriptNotice {url} />
			</div>
		</aside>

		<article class="prose mt-8 max-w-none prose-invert lg:mt-0" use:external_links>
			<Content />
		</article>
	</div>

	<SupportBox />

	<EngagementButtons {slug} {title} />
</PageLayout>
