<script lang="ts">
	import { youtube } from '$lib/utils/youtube'

	const IFRAME_ALLOW =
		'accelerometer; autoplay; clipboard-write;' +
		' encrypted-media; gyroscope; picture-in-picture; web-share'

	const { url, title }: { url: string; title: string } = $props()
	const embed_url = $derived(youtube.get_embed_url(url))
</script>

{#if embed_url}
	<div
		class="relative my-6 aspect-video w-full overflow-hidden rounded-xl border border-white/5"
		data-testid="youtube-embed"
	>
		<iframe
			src={embed_url}
			{title}
			class="absolute inset-0 h-full w-full"
			loading="lazy"
			referrerpolicy="strict-origin-when-cross-origin"
			allow={IFRAME_ALLOW}
			allowfullscreen
		></iframe>
	</div>
{/if}
