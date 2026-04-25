<script lang="ts">
	import { AUTHOR } from '$lib/app'

	const TWITTER_CARD_TYPE = 'summary_large_image'

	interface Props {
		title: string
		description: string
		url: string
		type?: 'website' | 'article'
		image?: string | undefined
	}

	const { title, description, url, type = 'website', image }: Props = $props()
</script>

<svelte:head>
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content={type} />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
	<meta name="twitter:card" content={TWITTER_CARD_TYPE} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:site" content="@{AUTHOR.X_USERNAME}" />
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}
</svelte:head>
