<script lang="ts">
	import {
		CARD_IMAGE_CLASS,
		CARD_IMAGE_OVERLAY_CLASS,
		CARD_IMAGE_WRAPPER_CLASS,
	} from '$lib/constants/card-styles'
	import type { Snippet } from 'svelte'

	interface Props {
		src: string
		alt: string
		testid?: string | undefined
		// Rendered above the gradient overlay, inside the positioned wrapper, so a caller can pin a
		// mark to a corner of the image without duplicating this markup.
		badge?: Snippet | undefined
	}

	const { src, alt, testid, badge }: Props = $props()
</script>

<div class={CARD_IMAGE_WRAPPER_CLASS} data-testid={testid}>
	<img {src} {alt} class={CARD_IMAGE_CLASS} loading="lazy" />
	<div class={CARD_IMAGE_OVERLAY_CLASS}></div>
	{@render badge?.()}
</div>
