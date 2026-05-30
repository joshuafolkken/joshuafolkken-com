/**
 * Minimum content length (CJK characters + Latin word tokens) a blog post must
 * reach to display ads. Posts below this are treated as low-value pages and
 * serve no ads, per Google AdSense content-quality policy. Measured with
 * `content_length.measure`, not whitespace word counting (which is inaccurate
 * for Japanese). Tune this single value to change which posts are gated.
 */
const MIN_CONTENT_LENGTH_FOR_ADS = 700

function should_show_ads(content_length: number): boolean {
	return content_length >= MIN_CONTENT_LENGTH_FOR_ADS
}

const ads_visibility = { should_show_ads }

export { MIN_CONTENT_LENGTH_FOR_ADS, ads_visibility }
