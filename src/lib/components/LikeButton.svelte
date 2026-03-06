<script lang="ts">
	import HeartIcon from '$lib/icons/HeartIcon.svelte'

	interface Props {
		count: number
		is_liked: boolean
		is_animating: boolean
		onclick: () => void
	}

	const { count, is_liked, is_animating, onclick }: Props = $props()

	const button_class = $derived(
		[
			'group relative flex items-center gap-3 rounded-full border px-6 py-3 transition-all duration-300',
			'hover:scale-105 active:scale-95 disabled:cursor-default disabled:active:scale-100 cursor-pointer',
			is_liked
				? 'border-red-900/40 bg-red-900/10 text-red-400'
				: 'border-white/10 bg-white/5 text-white/50 hover:border-red-900/30 hover:bg-red-900/10 hover:text-red-400',
		].join(' '),
	)

	const icon_class = $derived(
		[
			'h-6 w-6 transition-transform duration-300',
			is_liked ? 'fill-red-400 text-red-400' : 'group-hover:scale-110 group-hover:text-red-400',
			is_animating ? 'scale-125' : '',
		].join(' '),
	)

	const text_class = $derived(`font-medium ${is_liked ? 'text-red-400' : ''}`)

	const count_container_class = $derived(
		[
			'border-l pl-3 text-sm',
			is_liked ? 'border-red-900/30 text-red-400/80' : 'border-white/10 text-white/40',
		].join(' '),
	)
</script>

<button
	{onclick}
	class={button_class}
	disabled={is_liked}
	aria-label="Like this post"
	aria-pressed={is_liked}
	title={is_liked ? 'You have already liked this post' : 'Like this post'}
>
	<div class="relative">
		<HeartIcon class={icon_class} />
		{#if is_animating}
			<span
				class="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce text-sm font-bold text-red-500"
			>
				+1
			</span>
		{/if}
	</div>
	<span class={text_class}>
		{is_liked ? 'Thanks!' : 'Like'}
	</span>
	<span class={count_container_class}>
		{count}
	</span>
</button>
