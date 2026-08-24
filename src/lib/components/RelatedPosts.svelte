<script lang="ts">
	import BlogCard from '$lib/components/BlogCard.svelte'
	import SectionHeading from '$lib/components/SectionHeading.svelte'
	import BlogIcon from '$lib/icons/BlogIcon.svelte'
	import type { Post } from '$lib/types/blog'

	interface Props {
		posts: Array<Post>
	}

	const { posts }: Props = $props()
</script>

<!--
	Sits last, after the like and share row: those belong to the article just read, while this is
	where a reader who is done goes next. Hidden entirely when there is nothing to show rather
	than rendering a heading over an empty grid.

	The heading is hardcoded Japanese, like the landing-page intro (#609): this repository has no
	i18n infrastructure and #545 is blocked upstream, and the document under /blog is already
	declared `ja` by `hooks.server.ts`, so no language marker is needed here.
-->
{#if posts.length > 0}
	<section class="mt-20" data-testid="related-posts">
		<SectionHeading icon={BlogIcon} title="関連記事" class="mb-8" />

		<div class="grid gap-8 md:grid-cols-3">
			{#each posts as post (post.slug)}
				<BlogCard {post} />
			{/each}
		</div>
	</section>
{/if}
