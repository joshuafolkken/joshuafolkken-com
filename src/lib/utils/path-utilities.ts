function get_last_segment(path: string): string {
	return path.split('/').pop() ?? ''
}

function get_basename_without_extension(path_or_key: string): string {
	const filename = get_last_segment(path_or_key)

	return filename.replace(/\.[^.]+$/u, '')
}

const path_utilities = {
	get_basename_without_extension,
	get_last_segment,
}

export { path_utilities }
