<script lang="ts">
	import { resolve } from '$app/paths'
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import type { Component } from 'svelte'
	import ContentCard from './ContentCard.svelte'

	const {
		href,
		is_external = false,
		icon,
		title,
		subtitle,
		description,
	} = $props<{
		href: string
		is_external?: boolean
		icon: Component
		title: string
		subtitle?: string | undefined
		description?: string | undefined
	}>()
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	href={is_external ? href : resolve(href)}
	target={is_external ? LINK_TARGET : undefined}
	rel={is_external ? LINK_REL : undefined}
	class="link-base block"
>
	<ContentCard {icon} {title} {subtitle} {description} />
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
