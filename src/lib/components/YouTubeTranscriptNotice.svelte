<script lang="ts">
	import TalkIcon from '$lib/icons/TalkIcon.svelte'

	const { url }: { url: string } = $props()
</script>

<!-- Bare inline row: the enclosing meta panel owns the chrome (border, bg, spacing). -->
<div class="flex items-start gap-2 text-sm text-white/60" data-testid="youtube-transcript-notice">
	<TalkIcon size="1.1rem" class="mt-0.5 shrink-0 text-sky-400" aria_label="音声由来" />
	<p class="m-0">
		この記事は、<a href={url} class="text-sky-400 underline">YouTube 動画</a
		>の音声を文字起こしし、要約・再構成したものです。
	</p>
</div>
