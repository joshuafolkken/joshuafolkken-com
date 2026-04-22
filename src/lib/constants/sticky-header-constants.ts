import { ICON_SIZE_MD } from '$lib/constants/layout'
import { INTERACTIVE_SCALE_HOVER } from './interactive-effects'

const MENU_WIDTH = 280
const HEADER_ICON_SIZE = 24
const HEADER_FADE_DURATION_MS = 300

const HEADER_CONTAINER_CLASSES =
	'fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/70 px-6 backdrop-blur-md transition-all duration-500'
const HEADER_LEFT_SECTION_CLASSES = 'flex min-w-0 flex-1 items-center gap-4 md:gap-6'
const HEADER_RIGHT_SECTION_CLASSES = 'flex shrink-0 items-center gap-2'
const HEADER_HEIGHT = '4rem'
const HEADER_HEIGHT_PX = 64
const NAV_ICON_SIZE = ICON_SIZE_MD

const MENU_NAV_DESKTOP_BASE =
	'cyber-glow-hover group relative flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium'
const MENU_NAV_MOBILE_BASE =
	'cyber-glow-hover group -mx-4 flex items-center gap-3 rounded-none border-l-2 px-4 py-3 text-base transition-colors duration-300 hover:bg-white/10'
const MENU_NAV_ACTIVE_DESKTOP = 'text-sky-400'
const MENU_NAV_INACTIVE_DESKTOP = 'text-white/60 hover:text-white'
const MENU_NAV_ACTIVE_MOBILE =
	'border-sky-400 text-sky-400 hover:text-sky-400 [&_svg]:text-sky-400 hover:[&_svg]:text-sky-400'
const MENU_NAV_INACTIVE_MOBILE =
	'border-transparent text-white/70 hover:text-white [&_svg]:text-inherit'

const MENU_NAV_ICON_DESKTOP = 'transition-all duration-300 ease-out group-hover:-translate-y-0.5'
const MENU_NAV_ICON_MOBILE = 'transition-all duration-300 ease-out group-hover:translate-x-1'

const HEADER_LOGO_GLOW_CLASS =
	'drop-shadow-[0_0_8px_rgba(56,189,248,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]'

const ICON_BUTTON_BASE =
	'flex h-9 w-9 items-center justify-center rounded-xl text-white/50 hover:text-white'

const SOCIAL_LINK_DESKTOP_CLASSES = `cyber-glow-hover ${ICON_BUTTON_BASE} ${INTERACTIVE_SCALE_HOVER}`

const MENU_TOGGLE_BUTTON_CLASSES = `cyber-glow-hover ${ICON_BUTTON_BASE} md:hidden ${INTERACTIVE_SCALE_HOVER}`
const SOCIAL_LINK_MOBILE_CLASSES = `cyber-glow-hover flex h-10 w-10 items-center justify-center rounded-full text-white/70 hover:text-white ${INTERACTIVE_SCALE_HOVER}`
const SOCIAL_LINK_CONTAINER_DESKTOP = 'hidden items-center gap-2 md:flex'
const SOCIAL_LINK_CONTAINER_MOBILE = 'mt-4 flex gap-2 p-4 pt-0 md:hidden'

const HEADER_PAGE_LINK_BASE =
	'group flex min-w-0 items-center gap-2 text-base font-medium text-white/80 md:hidden [&_svg]:text-inherit'
const HEADER_PAGE_LINK_ACTIVE = `cyber-glow-hover rounded-lg px-2 py-1 ${HEADER_PAGE_LINK_BASE} hover:text-white hover:[&_svg]:text-white`

const HEADER_LOGO_TEXT_VISIBLE = 'max-w-xs opacity-100'
const HEADER_LOGO_TEXT_HIDDEN = 'max-w-0 opacity-0 md:max-w-xs md:opacity-100'

const MENU_DRAWER_CLASSES =
	'fixed right-0 z-50 h-full overflow-y-auto border-l border-white/5 bg-slate-950/70 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-in-out'

type StickyHeaderVariant = 'desktop' | 'mobile'

export type { StickyHeaderVariant }
export {
	HEADER_CONTAINER_CLASSES,
	HEADER_FADE_DURATION_MS,
	HEADER_HEIGHT,
	HEADER_HEIGHT_PX,
	HEADER_ICON_SIZE,
	HEADER_LEFT_SECTION_CLASSES,
	HEADER_LOGO_GLOW_CLASS,
	HEADER_LOGO_TEXT_VISIBLE,
	HEADER_LOGO_TEXT_HIDDEN,
	HEADER_PAGE_LINK_ACTIVE,
	HEADER_PAGE_LINK_BASE,
	HEADER_RIGHT_SECTION_CLASSES,
	MENU_DRAWER_CLASSES,
	MENU_NAV_ACTIVE_DESKTOP,
	MENU_NAV_ACTIVE_MOBILE,
	MENU_NAV_DESKTOP_BASE,
	MENU_NAV_ICON_DESKTOP,
	MENU_NAV_ICON_MOBILE,
	MENU_NAV_INACTIVE_DESKTOP,
	MENU_NAV_INACTIVE_MOBILE,
	MENU_NAV_MOBILE_BASE,
	MENU_TOGGLE_BUTTON_CLASSES,
	MENU_WIDTH,
	NAV_ICON_SIZE,
	SOCIAL_LINK_CONTAINER_DESKTOP,
	SOCIAL_LINK_CONTAINER_MOBILE,
	SOCIAL_LINK_DESKTOP_CLASSES,
	SOCIAL_LINK_MOBILE_CLASSES,
}
