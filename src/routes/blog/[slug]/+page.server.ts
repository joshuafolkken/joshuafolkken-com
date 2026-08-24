import { related_post_source } from '$lib/server/related-post-source'
import type { PageServerLoad } from './$types'

// Server-only, so the related-post index — every post's body, plus a content-length measurement
// per post — is built where the markdown already lives, instead of shipping all of it to the
// browser through the universal load next door.
export const load: PageServerLoad = ({ params }) => {
	return { related_posts: related_post_source.load(params.slug) }
}
