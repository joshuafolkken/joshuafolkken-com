<script lang="ts">
	import {
		SECTION_HEADING_LIGHT_LG_CLASS,
		SECTION_ICON_SIZE,
		SECTION_ICON_WRAPPER_CLASS,
	} from '$lib/constants/typography'
	import type { Component } from 'svelte'

	interface Props {
		icon: Component
		title: string
		subtitle?: string | undefined
		class?: string | undefined
	}

	const { icon, title, subtitle, class: class_name = '' }: Props = $props()
</script>

<div class={class_name}>
	<div class="flex items-center gap-3">
		<div class={SECTION_ICON_WRAPPER_CLASS}>
			{#if icon}
				<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
				{@const Icon = icon}
				<Icon size={SECTION_ICON_SIZE} />
			{/if}
		</div>
		<h2 class={SECTION_HEADING_LIGHT_LG_CLASS}>{title}</h2>
	</div>
	{#if subtitle}
		<p class="mt-2 text-white/50">{subtitle}</p>
	{/if}
</div>
