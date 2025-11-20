import type { PageServerLoad } from './$types'

interface Post {
	slug: string
	title: string
	date: string
	excerpt: string
	cover_image?: string | undefined
}

interface Metadata {
	title?: unknown
	date?: unknown
	excerpt?: unknown
	cover_image?: unknown
}

interface MdsvexFile {
	metadata: Metadata
}

const is_mdsvex_file = (file: unknown): file is MdsvexFile => {
	return (
		typeof file === 'object' &&
		file !== null &&
		'metadata' in file &&
		typeof (file as MdsvexFile).metadata === 'object'
	)
}

const get_slug_from_path = (path: string): string | undefined => {
	return path.split('/').pop()?.replace('.md', '')
}

const has_valid_metadata = (
	metadata: Metadata,
): metadata is { title: string; date: string; excerpt: string; cover_image?: string } => {
	return (
		typeof metadata.title === 'string' &&
		typeof metadata.date === 'string' &&
		typeof metadata.excerpt === 'string' &&
		(metadata.cover_image === undefined || typeof metadata.cover_image === 'string')
	)
}

const parse_post = (path: string, file: unknown): Post | undefined => {
	const slug = get_slug_from_path(path)
	if (slug === undefined || slug === '') {
		return undefined
	}

	if (!is_mdsvex_file(file)) {
		return undefined
	}

	if (!has_valid_metadata(file.metadata)) {
		return undefined
	}

	return {
		slug,
		title: file.metadata.title,
		date: file.metadata.date,
		excerpt: file.metadata.excerpt,
		cover_image: file.metadata.cover_image,
	}
}

export const load: PageServerLoad = () => {
	const paths = import.meta.glob('/src/lib/posts/*.md', { eager: true })

	const posts = Object.entries(paths)
		.map(([path, file]) => parse_post(path, file))
		.filter((post): post is Post => post !== undefined)
		.toSorted((post_a, post_b) => new Date(post_b.date).getTime() - new Date(post_a.date).getTime())

	return { posts }
}
