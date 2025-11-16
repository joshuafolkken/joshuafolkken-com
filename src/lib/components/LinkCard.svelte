<script lang="ts">
	import { resolve } from '$app/paths'
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import type { Page } from '$lib/types/page'
	import ContentCard from './ContentCard.svelte'

	interface Props {
		page: Page
	}

	const { page }: Props = $props()
	const { title, description, icon } = page

	const link = page.link ?? ''
	const is_external = link.startsWith('http')

	function get_href(): string | undefined {
		if (link === '') {
			return undefined
		}
		if (is_external) {
			return link
		}
		return resolve(link as '/projects' | '/profile' | '/privacy-policy')
	}

	const href = get_href()
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
{#if href}
	<a
		{href}
		target={is_external ? LINK_TARGET : undefined}
		rel={is_external ? LINK_REL : undefined}
		class="link-base block"
	>
		<ContentCard {icon} {title} {description} />
	</a>
{:else}
	<ContentCard {icon} {title} {description} />
{/if}
<!-- eslint-enable svelte/no-navigation-without-resolve -->
