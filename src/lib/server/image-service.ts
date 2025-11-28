import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const CONTENT_TYPE_WEBP = 'image/webp'
const WEBP_EXTENSION = '.webp'
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png']
const DEFAULT_WIDTH = 1344
const WEBP_QUALITY = 80
const ERROR_SOURCE_IMAGE_NOT_FOUND = 'Source image not found'

function get_images_directory(): string {
	return path.join(process.cwd(), 'static', 'images', 'blog')
}

function find_source_image(images_directory: string, base_name: string): string | undefined {
	for (const extension of SOURCE_EXTENSIONS) {
		const probe_path = path.join(images_directory, base_name + extension)
		if (existsSync(probe_path)) {
			return probe_path
		}
	}

	return undefined
}

async function convert_and_save_image(
	source_path: string,
	destination_path: string,
): Promise<Buffer> {
	const image_buffer = await fs.readFile(source_path)
	const pipeline = sharp(image_buffer).resize({
		width: DEFAULT_WIDTH,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		withoutEnlargement: true,
	})

	const webp_buffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer()
	await fs.writeFile(destination_path, webp_buffer)
	return webp_buffer
}

function get_target_file_path(images_directory: string, base_name: string): string {
	const target_filename = `${base_name}-w${String(DEFAULT_WIDTH)}${WEBP_EXTENSION}`
	return path.join(images_directory, target_filename)
}

async function create_optimized_image(
	images_directory: string,
	base_name: string,
	destination_path: string,
): Promise<Buffer> {
	const source_path = find_source_image(images_directory, base_name)

	if (source_path === undefined) {
		throw new Error(ERROR_SOURCE_IMAGE_NOT_FOUND)
	}

	return await convert_and_save_image(source_path, destination_path)
}

async function get_optimized_image(
	filename: string,
): Promise<{ buffer: Buffer; content_type: string }> {
	const images_directory = get_images_directory()
	const base_name = path.basename(filename, WEBP_EXTENSION)
	const file_path = get_target_file_path(images_directory, base_name)

	if (existsSync(file_path)) {
		const buffer = await fs.readFile(file_path)
		return { buffer, content_type: CONTENT_TYPE_WEBP }
	}

	const buffer = await create_optimized_image(images_directory, base_name, file_path)
	return { buffer, content_type: CONTENT_TYPE_WEBP }
}

export const image_service = {
	get_optimized_image,
	webp_extension: WEBP_EXTENSION,
	error_source_image_not_found: ERROR_SOURCE_IMAGE_NOT_FOUND,
}
