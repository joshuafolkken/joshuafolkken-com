<script lang="ts">
	interface Props {
		text_to_copy: string
		class?: string
	}

	const { text_to_copy, class: class_name = '' }: Props = $props()

	let is_copied = $state(false)
	const COPIED_TIMEOUT_MS = 10_000

	function copy(): void {
		void navigator.clipboard.writeText(text_to_copy)
		is_copied = true
		setTimeout(() => {
			is_copied = false
		}, COPIED_TIMEOUT_MS)
	}
</script>

<button
	onclick={copy}
	class="group relative inline-flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border border-white/10 text-neutral-400 transition-all duration-300 hover:border-white/0 hover:bg-white/20 hover:text-white {class_name}"
	aria-label="Copy Link"
>
	{#if is_copied}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-5 w-5"
		>
			<polyline points="20 6 9 17 4 12"></polyline>
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-5 w-5"
		>
			<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
		</svg>
	{/if}

	<!-- Tooltip -->
	<span
		class="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	>
		{is_copied ? 'Copied!' : 'Copy Link'}
	</span>
</button>
