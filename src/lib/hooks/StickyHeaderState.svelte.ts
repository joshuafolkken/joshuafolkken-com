import { keyboard_utilities } from '$lib/utils/keyboard-utilities'

const MENU_CLOSE_DELAY_MS = 400

let is_menu_open = $state(false)
let close_timer = $state<ReturnType<typeof setTimeout> | undefined>()
let is_hovering_button = $state(false)
let is_hovering_menu = $state(false)

function clear_close_timer(): void {
	if (close_timer === undefined) {
		return
	}

	clearTimeout(close_timer)
	close_timer = undefined
}

function open_menu(): void {
	clear_close_timer()
	is_menu_open = true
}

function close_menu(): void {
	is_menu_open = false
}

function schedule_close(): void {
	clear_close_timer()
	close_timer = setTimeout(() => {
		close_menu()
		close_timer = undefined
	}, MENU_CLOSE_DELAY_MS)
}

function handle_button_enter(): void {
	is_hovering_button = true
	open_menu()
}

function handle_button_leave(): void {
	is_hovering_button = false
	if (!is_hovering_menu) schedule_close()
}

function handle_menu_enter(): void {
	is_hovering_menu = true
	clear_close_timer()
}

function handle_menu_leave(): void {
	is_hovering_menu = false
	if (!is_hovering_button) schedule_close()
}

function handle_toggle_click(): void {
	if (is_menu_open) close_menu()
	else open_menu()
}

function handle_keydown(event: KeyboardEvent): void {
	if (is_menu_open && keyboard_utilities.is_escape(event)) close_menu()
}

function get_is_menu_open(): boolean {
	return is_menu_open
}

const sticky_header_state = {
	close_menu,
	get_is_menu_open,
	handle_button_enter,
	handle_button_leave,
	handle_keydown,
	handle_menu_enter,
	handle_menu_leave,
	handle_toggle_click,
}

export { sticky_header_state }
