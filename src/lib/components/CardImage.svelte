<script lang="ts">
	import {
		CARD_IMAGE_CLASS,
		CARD_IMAGE_OVERLAY_CLASS,
		CARD_IMAGE_WRAPPER_CLASS,
	} from '$lib/constants/card-styles'

	const { src, alt }: { src: string; alt: string } = $props()
</script>

<div class={CARD_IMAGE_WRAPPER_CLASS}>
	<img {src} {alt} class={CARD_IMAGE_CLASS} />
	<div class={CARD_IMAGE_OVERLAY_CLASS}></div>
</div>
