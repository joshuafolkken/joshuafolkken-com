<script lang="ts">
	import { resolve } from '$app/paths'

	interface Props {
		size?: number
	}

	const DEFAULT_SIZE = 80
	const { size = DEFAULT_SIZE }: Props = $props()
</script>

<a href={resolve('/')}>
	<svg
		viewBox="20 20 45 55"
		width={size}
		height={size}
		class=" text-white"
		aria-label="Geometric JF Fusion Logo"
	>
		<title>Geometric JF Fusion</title>
		<!-- J の要素 -->
		<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
		<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
		<rect x="20" y="62" width="12" height="8" fill="currentColor"></rect>
		<!-- F の要素（J と重なる） -->
		<rect x="40" y="20" width="8" height="55" fill="currentColor"></rect>
		<rect x="40" y="20" width="25" height="8" fill="currentColor"></rect>
		<rect x="40" y="45" width="20" height="8" fill="currentColor"></rect>
	</svg>
</a>
