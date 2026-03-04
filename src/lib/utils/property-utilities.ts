function with_optional_on_click(on_click?: () => void): { on_click?: () => void } {
	return on_click ? { on_click } : {}
}

const property_utilities = {
	with_optional_on_click,
}

export { property_utilities }
