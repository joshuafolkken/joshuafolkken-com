<script lang="ts">
	import { CARD_IMAGE_OVERLAY_CLASS, CARD_IMAGE_WRAPPER_CLASS } from '$lib/constants/card-styles'
	import YouTubeIcon from '$lib/icons/YouTubeIcon.svelte'

	const YOUTUBE_ICON_SIZE = '4rem'
</script>

<div
	class="{CARD_IMAGE_WRAPPER_CLASS} flex items-center justify-center bg-slate-950/60"
	data-testid="youtube-thumbnail"
>
	<span class="text-[#ff0000] transition-transform duration-1000 group-hover:scale-120">
		<YouTubeIcon size={YOUTUBE_ICON_SIZE} />
	</span>
	<div class={CARD_IMAGE_OVERLAY_CLASS}></div>
</div>
