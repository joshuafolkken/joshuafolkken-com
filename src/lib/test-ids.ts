// `data-testid` values that more than one spec depends on, so there is one definition to change
// instead of a literal to keep in step. A testid used by a single spec stays a local constant
// there — this module is for the shared ones only.
export const TEST_IDS = {
	YOUTUBE_EMBED: 'youtube-embed',
} as const
