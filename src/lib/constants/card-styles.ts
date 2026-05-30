const CARD_BASE_CLASS =
	'cyber-card group rounded-2xl border border-white/5 bg-slate-900/50' +
	' hover:-translate-y-1 hover:border-sky-400/40 hover:bg-slate-800/80'

const CARD_WRAPPER_CLASS = `relative flex flex-col overflow-hidden ${CARD_BASE_CLASS}`

const CARD_TITLE_CLASS = 'text-white/70 transition-colors duration-300 group-hover:text-white'
const CARD_DESCRIPTION_CLASS =
	'text-sm text-white/50 transition-colors duration-300 group-hover:text-white/80'

const CARD_IMAGE_WRAPPER_CLASS = 'relative aspect-video w-full overflow-hidden'
const CARD_IMAGE_CLASS =
	'h-full w-full object-cover transition-transform duration-1000 group-hover:scale-120'
const CARD_IMAGE_OVERLAY_CLASS =
	'absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-60'

const PROJECT_CARD_TAGS_ROW_CLASS = 'mt-3 flex flex-wrap gap-2.5'

const PROJECT_CARD_LINK_BUTTON_CLASS =
	'flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 group-hover:text-white/80 hover:text-sky-400'

export {
	CARD_BASE_CLASS,
	CARD_DESCRIPTION_CLASS,
	CARD_IMAGE_CLASS,
	CARD_IMAGE_OVERLAY_CLASS,
	CARD_IMAGE_WRAPPER_CLASS,
	CARD_TITLE_CLASS,
	CARD_WRAPPER_CLASS,
	PROJECT_CARD_LINK_BUTTON_CLASS,
	PROJECT_CARD_TAGS_ROW_CLASS,
}
