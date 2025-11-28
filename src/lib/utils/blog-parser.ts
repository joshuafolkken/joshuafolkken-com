import type { Post } from '$lib/types/blog'

interface Metadata {
	title?: unknown
	date?: unknown
	updated?: unknown
	excerpt?: unknown
	cover_image?: unknown
}

interface MdsvexFile {
	metadata: Metadata
}

function is_mdsvex_file(file: unknown): file is MdsvexFile {
	return (
		typeof file === 'object' &&
		file !== null &&
		'metadata' in file &&
		typeof (file as MdsvexFile).metadata === 'object'
	)
}

function get_slug_from_path(path: string): string | undefined {
	return path.split('/').pop()?.replace('.md', '')
}

function is_optional_string(value: unknown): boolean {
	return value === undefined || typeof value === 'string'
}

function has_valid_metadata(metadata: Metadata): metadata is {
	title: string
	date: string
	updated?: string
	excerpt: string
	cover_image?: string
} {
	return (
		typeof metadata.title === 'string' &&
		typeof metadata.date === 'string' &&
		is_optional_string(metadata.updated) &&
		typeof metadata.excerpt === 'string' &&
		is_optional_string(metadata.cover_image)
	)
}

function parse_post(path: string, file: unknown): Post | undefined {
	const slug = get_slug_from_path(path)

	if (slug === undefined || slug === '' || !is_mdsvex_file(file)) {
		return undefined
	}

	if (!has_valid_metadata(file.metadata)) {
		return undefined
	}

	return {
		slug,
		title: file.metadata.title,
		date: file.metadata.date,
		updated: file.metadata.updated,
		excerpt: file.metadata.excerpt,
		cover_image: file.metadata.cover_image,
	}
}

export const blog_parser = {
	is_mdsvex_file,
	get_slug_from_path,
	parse_post,
}
