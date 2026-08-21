export const TEST_ROUTES = {
	HOME: '/',
	ABOUT: '/about',
	BLOG: '/blog',
	BLOG_POST: '/blog/mnemecha',
	BLOG_YOUTUBE_POST: '/blog/talk-2026-01-22',
	// The content-length gates — no ads, robots noindex, sitemap exclusion — can only be exercised
	// against a post that really is below MIN_SUBSTANTIAL_CONTENT_LENGTH. That makes the fixture an
	// editorial fact rather than something the tests control, and it broke in four places at once
	// when `first-post` was expanded (#847). Keeping it here means the next expansion is one edit.
	//
	// Choose a replacement that #833 is not queued to expand. This talk post qualifies: #834
	// classifies it as off-topic for the site and recommends hiding it from search rather than
	// lengthening it, so its length is not scheduled to change.
	BLOG_THIN_POST: '/blog/talk-2026-07-30',
	CONTACT: '/contact',
	PROJECTS: '/projects',
} as const
