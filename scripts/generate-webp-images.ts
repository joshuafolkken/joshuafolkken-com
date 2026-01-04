import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
const root_directory = path.join(_dirname, '..')

const WEBP_EXTENSION = '.webp'
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png']
const DEFAULT_WIDTH = 1344
const WEBP_QUALITY = 80

function get_source_images_directory(image_type: 'blog' | 'projects'): string {
	return path.join(root_directory, 'static-source', 'images', image_type)
}

function get_target_images_directory(image_type: 'blog' | 'projects'): string {
	return path.join(root_directory, 'static', 'images', image_type)
}

function get_target_file_path(target_images_directory: string, base_name: string): string {
	const target_filename = `${base_name}${WEBP_EXTENSION}`
	return path.join(target_images_directory, target_filename)
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
): Promise<void> {
	const image_buffer = await fs.readFile(source_path)
	const pipeline = sharp(image_buffer).resize({
		width: DEFAULT_WIDTH,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		withoutEnlargement: true,
	})

	const webp_buffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer()
	await fs.writeFile(destination_path, webp_buffer)
}

function filter_source_files(files: Array<string>): Array<string> {
	return files.filter((file) => {
		const extension = path.extname(file).toLowerCase()
		return SOURCE_EXTENSIONS.includes(extension)
	})
}

function should_skip_conversion(target_path: string, source_file: string): boolean {
	if (existsSync(target_path)) {
		console.info(`  ✓ Skipped: ${source_file} (WebP already exists)`)
		return true
	}

	return false
}

async function convert_image_with_logging(
	source_path: string,
	target_path: string,
	source_file: string,
): Promise<void> {
	try {
		await convert_and_save_image(source_path, target_path)
		console.info(`  ✓ Converted: ${source_file} -> ${path.basename(target_path)}`)
	} catch (error: unknown) {
		console.error(`  ✗ Error: Failed to convert ${source_file}`, error)
	}
}

async function process_single_image(
	source_file: string,
	source_images_directory: string,
	target_images_directory: string,
): Promise<void> {
	const base_name = path.basename(source_file, path.extname(source_file))
	const target_path = get_target_file_path(target_images_directory, base_name)

	if (should_skip_conversion(target_path, source_file)) {
		return
	}

	const source_path = find_source_image(source_images_directory, base_name)

	if (source_path === undefined) {
		console.warn(`  ⚠ Warning: Source image not found for ${source_file}`)
		return
	}

	await convert_image_with_logging(source_path, target_path, source_file)
}

async function process_image_type(image_type: 'blog' | 'projects'): Promise<void> {
	const source_images_directory = get_source_images_directory(image_type)
	const target_images_directory = get_target_images_directory(image_type)

	// ターゲットディレクトリが存在しない場合は作成
	await fs.mkdir(target_images_directory, { recursive: true })

	const files = await fs.readdir(source_images_directory)

	// 元画像ファイル（.jpg, .jpeg, .png）をフィルタリング
	const source_files = filter_source_files(files)

	console.info(`\n${image_type} directory: Processing ${String(source_files.length)} image(s)`)

	for (const source_file of source_files) {
		await process_single_image(source_file, source_images_directory, target_images_directory)
	}
}

async function main(): Promise<void> {
	console.info('Starting WebP image generation...')
	await process_image_type('blog')
	await process_image_type('projects')
	console.info('\nWebP image generation completed')
}

try {
	await main()
} catch (error: unknown) {
	console.error('An error occurred:', error)
	process.exit(1)
}
