import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
const root_directory = path.join(_dirname, '..')

const WEBP_EXTENSION = '.webp'
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png'])
const IMAGE_TYPES = ['blog', 'projects'] as const

function get_source_images_directory(image_type: 'blog' | 'projects'): string {
	return path.join(root_directory, 'static-source', 'images', image_type)
}

function get_target_images_directory(image_type: 'blog' | 'projects'): string {
	return path.join(root_directory, 'static', 'images', image_type)
}

function get_webp_file_path(target_images_directory: string, base_name: string): string {
	const target_filename = `${base_name}${WEBP_EXTENSION}`
	return path.join(target_images_directory, target_filename)
}

function filter_source_files(files: Array<string>): Array<string> {
	return files.filter((file) => {
		const extension = path.extname(file).toLowerCase()
		return SOURCE_EXTENSIONS.has(extension)
	})
}

async function get_source_files(
	source_images_directory: string,
	image_type: string,
): Promise<Array<string>> {
	if (!existsSync(source_images_directory)) {
		console.warn(`Source directory does not exist: ${source_images_directory}`)
		return []
	}

	const files = await readdir(source_images_directory)
	const source_files = filter_source_files(files)

	if (source_files.length === 0) {
		console.info(`No source images found in ${image_type} directory`)
		return []
	}

	return source_files
}

function find_missing_webp_files(
	source_files: Array<string>,
	target_images_directory: string,
): Array<string> {
	const missing_webp_files: Array<string> = []

	for (const source_file of source_files) {
		const base_name = path.basename(source_file, path.extname(source_file))
		const webp_path = get_webp_file_path(target_images_directory, base_name)

		if (!existsSync(webp_path)) {
			missing_webp_files.push(source_file)
		}
	}

	return missing_webp_files
}

describe('WebP image files', () => {
	for (const image_type of IMAGE_TYPES) {
		describe(`${image_type} images`, () => {
			it(`should have corresponding WebP files for all source images in ${image_type}`, async () => {
				const source_images_directory = get_source_images_directory(image_type)
				const target_images_directory = get_target_images_directory(image_type)

				const source_files = await get_source_files(source_images_directory, image_type)

				if (source_files.length === 0) {
					return
				}

				const missing_webp_files = find_missing_webp_files(source_files, target_images_directory)

				if (missing_webp_files.length > 0) {
					console.error(
						`Missing WebP files for ${image_type}:\n${missing_webp_files
							.map((file) => `  - ${file}`)
							.join('\n')}`,
					)
				}

				expect(missing_webp_files).toHaveLength(0)
			})
		})
	}
})
