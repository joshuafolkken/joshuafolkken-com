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
	youtube_title?: unknown
}

interface MdsvexFile {
	metadata: MdsvexMetadata
}

interface FrontmatterCoverImage {
	slug: string
	cover_image: string | undefined
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

// A value failing this is discarded by `parse_post` below, so the page renders with no cover at
// all. Exported because `post_standards.check_cover_image` has to apply the same rule to the
// frontmatter as written: a value dropped here never reaches a `Post` for a later check to see.
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
		youtube_title: to_optional_string(file.metadata.youtube_title),
	}
}

function glob_posts(): Record<string, { metadata: MdsvexMetadata }> {
	return import.meta.glob<{ metadata: MdsvexMetadata }>('/src/lib/posts/*.md', { eager: true })
}

function get_all_posts(): Array<Post> {
	return Object.entries(glob_posts())
		.map(([path, file]) => parse_post(path, file))
		.filter((post): post is Post => post !== undefined)
}

function to_frontmatter_cover_image(
	path: string,
	file: unknown,
): FrontmatterCoverImage | undefined {
	const slug = slug_validator.parse_slug(get_raw_slug_from_path(path))

	if (!slug || !is_mdsvex_file(file)) return undefined

	return { slug, cover_image: to_optional_string(file.metadata.cover_image) }
}

// `parse_post` discards a `cover_image` that is not a safe path, so a parsed `Post` cannot tell a
// dropped value from a post that never had one. This reads the frontmatter as written, which is
// what a check on the value has to see.
function list_frontmatter_cover_images(): Array<FrontmatterCoverImage> {
	return Object.entries(glob_posts())
		.map(([path, file]) => to_frontmatter_cover_image(path, file))
		.filter((entry): entry is FrontmatterCoverImage => entry !== undefined)
}

export const blog_parser = {
	get_all_posts,
	is_safe_cover_image_path,
	list_frontmatter_cover_images,
	parse_post,
}
export type { FrontmatterCoverImage }
