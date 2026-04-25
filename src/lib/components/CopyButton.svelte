<script lang="ts">
	import { SOCIAL_BUTTONS } from '$lib/constants/social-buttons'
	import CheckIcon from '$lib/icons/CheckIcon.svelte'
	import CopyIcon from '$lib/icons/CopyIcon.svelte'
	import { logger } from '$lib/logger'

	interface Props {
		text_to_copy: string
		class?: string
	}

	const { text_to_copy, class: class_name = '' }: Props = $props()

	let is_copied = $state(false)
	// eslint-disable-next-line unicorn/no-useless-undefined
	let copy_timer: ReturnType<typeof setTimeout> | undefined = undefined
	const COPIED_TIMEOUT_MS = 10_000

	function clear_copy_timer(): void {
		if (copy_timer === undefined) return
		clearTimeout(copy_timer)
		copy_timer = undefined
	}

	$effect(() => clear_copy_timer)

	async function write_to_clipboard(): Promise<void> {
		try {
			await navigator.clipboard.writeText(text_to_copy)
		} catch (error: unknown) {
			logger.error('Failed to copy to clipboard:', error)
		}
	}

	function copy(): void {
		void write_to_clipboard()
		is_copied = true
		clear_copy_timer()
		copy_timer = setTimeout(() => {
			is_copied = false
			copy_timer = undefined
		}, COPIED_TIMEOUT_MS)
	}
</script>

<button
	onclick={copy}
	class="group relative cursor-pointer {SOCIAL_BUTTONS.BASE} {SOCIAL_BUTTONS.COPY_HOVER} {class_name}"
	aria-label="Copy Link"
>
	<div class="relative">
		{#if is_copied}
			<CheckIcon />
		{:else}
			<CopyIcon />
		{/if}
		{#if is_copied}
			<span
				class="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce text-sm font-bold whitespace-nowrap text-white"
			>
				Copied!
			</span>
		{/if}
	</div>
</button>
