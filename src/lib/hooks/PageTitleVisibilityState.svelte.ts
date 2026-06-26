let is_page_title_visible = $state(true)

// eslint-disable-next-line unicorn/consistent-boolean-name -- accessor mirrors the is_page_title_visible $state; a boolean-prefixed name would shadow it
function get_is_visible(): boolean {
	return is_page_title_visible
}

function set_visible(is_visible: boolean): void {
	is_page_title_visible = is_visible
}

const page_title_visibility_state = {
	get_is_visible,
	set_visible,
}

export { page_title_visibility_state }
