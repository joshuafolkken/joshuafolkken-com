import type { BlogMetadata, Post } from '$lib/types/blog'
import { path_utilities } from '$lib/utils/path-utilities'
import { slug_validator } from '$lib/utils/slug-validator'

interface MdsvexMetadata {
	title?: unknown
	date?: unknown
	updated?: unknown
	author?: unknown
	excerpt?: unknown
	cover_image?: unknown
	youtube?: unknown
	youtube_date?: unknown
}

interface MdsvexFile {
	metadata: MdsvexMetadata
}

function is_mdsvex_file(file: unknown): file is MdsvexFile {
	return (
		typeof file === 'object' &&
		file !== null &&
		'metadata' in file &&
		typeof (file as MdsvexFile).metadata === 'object'
	)
}

function is_optional_string(value: unknown): boolean {
	return value === undefined || typeof value === 'string'
}

function to_optional_string(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined
}

function has_required_string_fields(metadata: MdsvexMetadata): boolean {
	return (
		typeof metadata.title === 'string' &&
		typeof metadata.date === 'string' &&
		typeof metadata.excerpt === 'string'
	)
}

function has_valid_metadata(metadata: MdsvexMetadata): metadata is BlogMetadata {
	return (
		has_required_string_fields(metadata) &&
		is_optional_string(metadata.updated) &&
		is_optional_string(metadata.author) &&
		is_optional_string(metadata.cover_image)
	)
}

function get_raw_slug_from_path(path: string): string | undefined {
	const slug = path_utilities.get_basename_without_extension(path)

	return slug || undefined
}

function is_safe_cover_image_path(path: string | undefined): path is string {
	if (!path || typeof path !== 'string') return false

	return path.startsWith('/') && !path.includes('//')
}

function parse_post(path: string, file: unknown): Post | undefined {
	const slug = slug_validator.parse_slug(get_raw_slug_from_path(path))

	if (!slug || !is_mdsvex_file(file)) {
		return undefined
	}

	if (!has_valid_metadata(file.metadata)) {
		return undefined
	}

	const cover_image = is_safe_cover_image_path(file.metadata.cover_image)
		? file.metadata.cover_image
		: undefined

	return {
		slug,
		title: file.metadata.title,
		date: file.metadata.date,
		updated: file.metadata.updated,
		author: file.metadata.author,
		excerpt: file.metadata.excerpt,
		cover_image,
		youtube: to_optional_string(file.metadata.youtube),
		youtube_date: to_optional_string(file.metadata.youtube_date),
	}
}

function get_all_posts(): Array<Post> {
	const posts = import.meta.glob<{ metadata: MdsvexMetadata }>('/src/lib/posts/*.md', {
		eager: true,
	})

	return Object.entries(posts)
		.map(([path, file]) => parse_post(path, file))
		.filter((post): post is Post => post !== undefined)
}

export const blog_parser = {
	get_all_posts,
	parse_post,
}
