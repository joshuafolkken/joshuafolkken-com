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
		xmlns="http://www.w3.org/2000/svg"
		viewBox="20 20 45 55"
		width={size}
		height={size}
		class="text-white"
		aria-label="Geometric JF Fusion Logo"
	>
		<defs>
			<filter id="outline">
				<feMorphology operator="dilate" radius="2" in="SourceAlpha" result="dilated"></feMorphology>
				<feFlood flood-color="black" flood-opacity="1" result="flood"></feFlood>
				<feComposite in="flood" in2="dilated" operator="in" result="outline"></feComposite>
				<feComposite in="SourceGraphic" in2="outline" operator="over"></feComposite>
			</filter>
		</defs>
		<title>Geometric JF Fusion</title>
		<g filter="url(#outline)">
			<!-- J の要素 -->
			<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
			<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
			<rect x="20" y="62" width="12" height="8" fill="currentColor"></rect>
			<!-- F の要素（J と重なる） -->
			<rect x="40" y="20" width="8" height="55" fill="currentColor"></rect>
			<rect x="40" y="20" width="25" height="8" fill="currentColor"></rect>
			<rect x="40" y="45" width="20" height="8" fill="currentColor"></rect>
		</g>
	</svg>
</a>
