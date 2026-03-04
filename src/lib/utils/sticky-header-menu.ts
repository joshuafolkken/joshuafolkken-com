import {
	MENU_NAV_ACTIVE_DESKTOP,
	MENU_NAV_ACTIVE_MOBILE,
	MENU_NAV_DESKTOP_BASE,
	MENU_NAV_ICON_DESKTOP,
	MENU_NAV_ICON_MOBILE,
	MENU_NAV_INACTIVE_DESKTOP,
	MENU_NAV_INACTIVE_MOBILE,
	MENU_NAV_MOBILE_BASE,
	type StickyHeaderVariant,
} from '$lib/constants/sticky-header-constants'
import { MAIN_NAV_PAGES, type Page } from '$lib/types/page'
import { link_utilities } from '$lib/utils/link-utilities'

const MENU_ITEMS: ReadonlyArray<{ page: Page }> = MAIN_NAV_PAGES.map((page) => ({ page }))

function is_menu_item_active(link: string | undefined, pathname: string): boolean {
	if (!link || link_utilities.is_external_link(link)) return false

	return pathname === link || (link !== '/' && pathname.startsWith(`${link}/`))
}

function get_active_class(variant: StickyHeaderVariant, is_active: boolean): string {
	if (variant === 'desktop') {
		return is_active ? MENU_NAV_ACTIVE_DESKTOP : MENU_NAV_INACTIVE_DESKTOP
	}

	return is_active ? MENU_NAV_ACTIVE_MOBILE : MENU_NAV_INACTIVE_MOBILE
}

function get_link_classes(variant: StickyHeaderVariant, is_active: boolean): string {
	const base = variant === 'desktop' ? MENU_NAV_DESKTOP_BASE : MENU_NAV_MOBILE_BASE
	const active = get_active_class(variant, is_active)

	return `${base} ${active}`
}

function get_icon_class(variant: StickyHeaderVariant): string {
	return variant === 'desktop' ? MENU_NAV_ICON_DESKTOP : MENU_NAV_ICON_MOBILE
}

const sticky_header_menu = {
	get_icon_class,
	get_link_classes,
	is_menu_item_active,
	menu_items: MENU_ITEMS,
}

export { sticky_header_menu }
