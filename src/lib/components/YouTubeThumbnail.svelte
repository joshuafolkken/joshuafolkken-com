<script lang="ts">
	import CardImage from '$lib/components/CardImage.svelte'
	import { CARD_IMAGE_OVERLAY_CLASS, CARD_IMAGE_WRAPPER_CLASS } from '$lib/constants/card-styles'
	import YouTubeIcon from '$lib/icons/YouTubeIcon.svelte'
	import { youtube } from '$lib/utils/youtube'

	const PLACEHOLDER_ICON_SIZE = '4rem'
	const BADGE_ICON_SIZE = '1.5rem'
	const THUMBNAIL_TESTID = 'youtube-thumbnail'
	const BADGE_TESTID = 'youtube-badge'
	// Bottom-left: the card's gradient overlay is darkest there, so the red mark keeps its contrast
	// even on a bright still, and it stays clear of the date pinned to the card's bottom-right.
	const BADGE_CLASS =
		'absolute bottom-2 left-2 flex rounded-md bg-slate-950/70 p-1 text-[#ff0000]' +
		' ring-1 ring-white/10'

	const { url, title }: { url: string; title: string } = $props()
	const thumbnail_url = $derived(youtube.get_thumbnail_url(url))
</script>

{#snippet badge()}
	<span class={BADGE_CLASS} data-testid={BADGE_TESTID}>
		<YouTubeIcon size={BADGE_ICON_SIZE} />
	</span>
{/snippet}

{#if thumbnail_url}
	<CardImage src={thumbnail_url} alt={title} testid={THUMBNAIL_TESTID} {badge} />
{:else}
	<div
		class="{CARD_IMAGE_WRAPPER_CLASS} flex items-center justify-center bg-slate-950/60"
		data-testid={THUMBNAIL_TESTID}
	>
		<span class="text-[#ff0000] transition-transform duration-1000 group-hover:scale-120">
			<YouTubeIcon size={PLACEHOLDER_ICON_SIZE} />
		</span>
		<div class={CARD_IMAGE_OVERLAY_CLASS}></div>
	</div>
{/if}
