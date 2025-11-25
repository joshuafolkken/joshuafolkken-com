<script lang="ts">
	import { page } from '$app/state'

	interface Props {
		class?: string
	}

	const { class: class_name = '' }: Props = $props()

	const url = $derived(page.url.toString())
	const href = $derived(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
</script>

<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class="inline-flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-all duration-300 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white {class_name}"
	aria-label="Share on Facebook"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		class="h-6 w-6"
	>
		<path
			d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"
		></path>
	</svg>
</a>
