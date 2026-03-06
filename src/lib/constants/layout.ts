type MaxWidthKey = 'sm' | '2xl' | '3xl' | '4xl'

/* eslint-disable @typescript-eslint/naming-convention -- Tailwind width keys */
const MAX_WIDTH_CLASS_MAP: Record<MaxWidthKey, string> = {
	sm: 'max-w-sm',
	'2xl': 'max-w-2xl',
	'3xl': 'max-w-3xl',
	'4xl': 'max-w-4xl',
}
/* eslint-enable @typescript-eslint/naming-convention */

const PAGE_PADDING_CLASS = 'mx-4 mt-8 mb-0'

/** Spacing between content bottom and footer line. */
const CONTENT_EDGE_SPACING_CLASS = 'mt-12'

const ICON_LABEL_ROW_CENTER_CLASS = 'flex items-center justify-center gap-2 text-white/80'

const ICON_SIZE_SM = '1rem'
const ICON_SIZE_MD = '1.25rem'
const ICON_SIZE_LG = '1.5rem'
const ICON_SIZE_XL = '2.25rem'
const ICON_SIZE_2XL = '2.5rem'

const LINK_BASE_CLASS = 'link-base'
const LINK_BASE_DEFAULT_CLASS = `${LINK_BASE_CLASS} text-white/80`

const BLOCKQUOTE_CLASS = 'border-l-4 border-white/30 pl-4 italic'

/** ID of the main content anchor for scroll links (e.g. from hero). */
const MAIN_CONTENT_ID = 'main-content'

function get_max_width_class(max_width: MaxWidthKey = '2xl'): string {
	return MAX_WIDTH_CLASS_MAP[max_width]
}

export type { MaxWidthKey }
export {
	BLOCKQUOTE_CLASS,
	CONTENT_EDGE_SPACING_CLASS,
	MAIN_CONTENT_ID,
	get_max_width_class,
	ICON_LABEL_ROW_CENTER_CLASS,
	ICON_SIZE_2XL,
	ICON_SIZE_LG,
	ICON_SIZE_MD,
	ICON_SIZE_SM,
	ICON_SIZE_XL,
	LINK_BASE_CLASS,
	LINK_BASE_DEFAULT_CLASS,
	MAX_WIDTH_CLASS_MAP,
	PAGE_PADDING_CLASS,
}
