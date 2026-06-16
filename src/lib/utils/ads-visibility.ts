import { content_quality } from '$lib/utils/content-quality'

/**
 * A post serves ads only when it is substantial enough. Ads visibility shares
 * the single content-quality threshold (`content_quality.is_substantial`) with
 * indexing, so low-value posts are gated from both ads and search indexing.
 */
function should_show_ads(content_length: number): boolean {
	return content_quality.is_substantial(content_length)
}

const ads_visibility = { should_show_ads }

export { ads_visibility }
