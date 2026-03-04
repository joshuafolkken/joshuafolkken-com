<script lang="ts">
	import { page } from '$app/state'
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import { SOCIAL_BUTTONS } from '$lib/constants/social-buttons'
	import { share_url_utilities } from '$lib/utils/share-url-utilities'

	type ShareType = 'facebook' | 'twitter'

	interface Props {
		type: ShareType
		title?: string
		class?: string
	}

	const { type, title = '', class: class_name = '' }: Props = $props()

	const url = $derived(page.url.toString())

	const href = $derived.by(() => {
		if (type === 'facebook') {
			return share_url_utilities.build_facebook_share_url(url)
		}

		return share_url_utilities.build_twitter_share_url(url, title)
	})

	const hover_class = $derived(
		type === 'facebook' ? SOCIAL_BUTTONS.FACEBOOK_HOVER : SOCIAL_BUTTONS.TWITTER_HOVER,
	)

	const { aria_label, svg_path, view_box, icon_class, svg_width, svg_height } = $derived.by(() => {
		if (type === 'facebook') {
			return {
				aria_label: 'Share on Facebook',
				svg_path:
					'M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z',
				view_box: '0 0 24 24',
				icon_class: 'h-6 w-6',
				svg_width: '24',
				svg_height: '24',
			}
		}

		return {
			aria_label: 'Share on X',
			svg_path:
				'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
			view_box: '0 0 24 24',
			icon_class: 'h-5 w-5',
			svg_width: '16',
			svg_height: '16',
		}
	})
</script>

<a
	{href}
	target={LINK_TARGET}
	rel={LINK_REL}
	class="{SOCIAL_BUTTONS.BASE} {hover_class} {class_name}"
	aria-label={aria_label}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={svg_width}
		height={svg_height}
		viewBox={view_box}
		fill="currentColor"
		class={icon_class}
	>
		<path d={svg_path}></path>
	</svg>
</a>
