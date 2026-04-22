const PRINT_TO_ALL_MEDIA = 'all'

function on_font_load(event: Event): void {
	const { target } = event

	if (!(target instanceof HTMLLinkElement)) return

	target.media = PRINT_TO_ALL_MEDIA
}

const font_load_handler = { on_font_load }

export { font_load_handler }
