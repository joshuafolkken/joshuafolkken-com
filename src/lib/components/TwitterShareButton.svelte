<script lang="ts">
	import { page } from '$app/state'

	interface Props {
		title: string
		class?: string
	}

	const { title, class: class_name = '' }: Props = $props()

	const url = $derived(page.url.toString())
	const twitter_share_url = $derived(
		`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
	)
</script>

<a
	href={twitter_share_url}
	target="_blank"
	rel="noopener noreferrer"
	class="inline-flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-all duration-300 hover:border-black hover:bg-black hover:text-white {class_name}"
	aria-label="Share on X"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="currentColor"
		class="h-5 w-5"
	>
		<path
			d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
		></path>
	</svg>
</a>
