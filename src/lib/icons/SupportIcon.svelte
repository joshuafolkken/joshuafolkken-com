<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Support',
		aria_label,
		class: class_name,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
		class?: string
	}>()

	const mask_id = 'support-icon-yen-mask'
</script>

<svg
	viewBox="1.2 -0.3 21.6 21.6"
	width={size}
	height={size}
	class={class_name}
	role="img"
	aria-label={aria_label}
	fill="none"
>
	<title>{title}</title>
	<defs>
		<mask id={mask_id}>
			<rect width="100%" height="100%" fill="white"></rect>
			<!-- 円マーク: 少し太くして中央に配置 -->
			<g
				stroke="black"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				transform="translate(0, 0.2)"
			>
				<path d="M10 8.5l2 2.5 2-2.5"></path>
				<path d="M12 11v4.5"></path>
				<path d="M9.5 13h5"></path>
				<path d="M9.5 15h5"></path>
			</g>
		</mask>
	</defs>

	<!-- ぽっちゃりしたハート (Material Design風) -->
	<path
		d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
		fill="currentColor"
		mask="url(#{mask_id})"
	></path>
</svg>
