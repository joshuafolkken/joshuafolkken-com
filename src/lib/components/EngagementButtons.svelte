<script lang="ts">
	import LikeButton from '$lib/components/LikeButton.svelte'
	import { LikeState } from '$lib/hooks/LikeState.svelte'
	import type { HTMLAttributes } from 'svelte/elements'
	import ShareButtons from './ShareButtons.svelte'

	interface Props extends HTMLAttributes<HTMLDivElement> {
		slug: string
		title: string
	}

	const { slug, title, class: class_name = '', ...rest }: Props = $props()
	const like_state = new LikeState(slug)
</script>

<div class="mb-4 flex flex-row items-center justify-center gap-4 {class_name}" {...rest}>
	<LikeButton
		count={like_state.count}
		is_liked={like_state.is_liked}
		is_animating={like_state.is_animating}
		onclick={() => {
			void like_state.toggle()
		}}
	/>

	<ShareButtons {title} />
</div>
