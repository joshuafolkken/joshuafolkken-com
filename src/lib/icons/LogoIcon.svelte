<script lang="ts">
	interface Props {
		size?: number
		radius?: number
		class?: string
	}

	const DEFAULT_SIZE = 80
	const { size = DEFAULT_SIZE, radius = 0, class: class_name = '' }: Props = $props()
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="20 18 45 59"
	width={size}
	height={size}
	class={class_name}
	aria-label="Geometric JF Fusion Logo"
>
	<defs>
		<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="1.2" result="blur"></feGaussianBlur>
			<feFlood flood-color="white" flood-opacity="0.3" result="glowColor"></feFlood>
			<feComposite in="glowColor" in2="blur" operator="in" result="softGlow"></feComposite>
			<feMerge>
				<feMergeNode in="softGlow"></feMergeNode>
				<feMergeNode in="SourceGraphic"></feMergeNode>
			</feMerge>
		</filter>
		<filter id="outline">
			<feMorphology operator="dilate" {radius} in="SourceAlpha" result="dilated"></feMorphology>
			<feFlood flood-color="#0008" flood-opacity="1" result="flood"></feFlood>
			<feComposite in="flood" in2="dilated" operator="in" result="outline"></feComposite>
			<feComposite in="SourceGraphic" in2="outline" operator="over"></feComposite>
		</filter>
	</defs>
	<title>Geometric JF Fusion</title>
	<g filter="url(#glow)">
		<g filter="url(#outline)" class="text-white drop-shadow-sm">
			<!-- J の要素 -->
			<rect x="20" y="20" width="8" height="50" fill="currentColor"></rect>
			<rect x="20" y="20" width="20" height="8" fill="currentColor"></rect>
			<rect x="20" y="62" width="12" height="8" fill="currentColor"></rect>
			<!-- F の要素（J と重なる） -->
			<rect x="40" y="20" width="8" height="55" fill="currentColor"></rect>
			<rect x="40" y="20" width="25" height="8" fill="currentColor"></rect>
			<rect x="40" y="45" width="20" height="8" fill="currentColor"></rect>
		</g>
	</g>
</svg>
