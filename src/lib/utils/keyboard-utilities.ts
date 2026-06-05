const ESCAPE_KEY = 'Escape'
const ENTER_KEY = 'Enter'

function is_escape(event: { key: string }): boolean {
	return event.key === ESCAPE_KEY
}

// Excludes the Enter that confirms an IME composition (e.g. Japanese conversion),
// so committing a candidate does not trigger the action bound to Enter.
function is_enter(event: { key: string; isComposing?: boolean }): boolean {
	return event.key === ENTER_KEY && event.isComposing !== true
}

const keyboard_utilities = {
	is_enter,
	is_escape,
}

export { keyboard_utilities }
