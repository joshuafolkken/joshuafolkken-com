<script lang="ts">
	import { page } from '$app/state'
	import CopyButton from './CopyButton.svelte'
	import TwitterShareButton from './TwitterShareButton.svelte'

	interface Props {
		title: string
		class?: string
	}

	const { title, class: class_name = '' }: Props = $props()

	const url = $derived(page.url.toString())
</script>

<!-- X (Twitter) -->
<TwitterShareButton {title} class={class_name} />

<!-- Facebook -->
<!-- <FacebookShareButton class={class_name} /> -->

<!-- Copy Link -->
<CopyButton text_to_copy={`${title}\n${url}`} class={class_name} />
