const ESCAPE_KEY = 'Escape'

function is_escape(event: { key: string }): boolean {
	return event.key === ESCAPE_KEY
}

const keyboard_utilities = {
	is_escape,
}

export { keyboard_utilities }
