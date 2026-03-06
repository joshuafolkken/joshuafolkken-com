<script lang="ts">
	import type { Snippet } from 'svelte'

	const {
		size = '1.5rem',
		title,
		aria_label,
		class: class_name = '',
		children,
		view_box = '0 0 24 24',
		fill = 'none',
		stroke = 'currentColor',
		stroke_width = '2',
		stroke_linecap = 'round',
		stroke_linejoin = 'round',
	} = $props<{
		size?: string
		title: string
		aria_label?: string
		class?: string
		children: Snippet
		view_box?: string
		fill?: string
		stroke?: string
		stroke_width?: string
		stroke_linecap?: 'round' | 'butt' | 'square' | 'inherit'
		stroke_linejoin?: 'round' | 'miter' | 'bevel' | 'inherit'
	}>()
</script>

<svg
	viewBox={view_box}
	width={size}
	height={size}
	class={class_name}
	role="img"
	aria-label={aria_label ?? title}
	{fill}
	{stroke}
	stroke-width={stroke_width}
	stroke-linecap={stroke_linecap}
	stroke-linejoin={stroke_linejoin}
>
	<title>{title}</title>
	{@render children()}
</svg>
