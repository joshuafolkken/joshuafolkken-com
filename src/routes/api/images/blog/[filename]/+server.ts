import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { error as http_error } from '@sveltejs/kit'
import { HTTP_STATUS } from '$lib/constants/http'
import sharp from 'sharp'
import type { RequestHandler } from './$types'

const CACHE_CONTROL = 'public, max-age=31536000'
const CONTENT_TYPE_WEBP = 'image/webp'
const WEBP_EXTENSION = '.webp'
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png']
const DEFAULT_WIDTH = 1344

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

	const webp_buffer = await pipeline.webp({ quality: 80 }).toBuffer()
	await fs.writeFile(destination_path, webp_buffer)
	return webp_buffer
}

function create_response(body: BodyInit): Response {
	return new Response(body, {
		headers: {
			'Content-Type': CONTENT_TYPE_WEBP,
			'Cache-Control': CACHE_CONTROL,
		},
	})
}

function is_http_error(value: unknown): value is { status: number } {
	return typeof value === 'object' && value !== null && 'status' in value
}

async function get_optimized_image(
	images_directory: string,
	base_name: string,
): Promise<{ buffer: Buffer | undefined; file_path: string }> {
	const filename = `${base_name}-w${String(DEFAULT_WIDTH)}${WEBP_EXTENSION}`
	const file_path = path.join(images_directory, filename)

	if (existsSync(file_path)) {
		const buffer = await fs.readFile(file_path)
		return { buffer, file_path }
	}

	return { buffer: undefined, file_path }
}

async function generate_new_image(
	images_directory: string,
	base_name: string,
	destination_path: string,
): Promise<Buffer> {
	const source_path = find_source_image(images_directory, base_name)

	if (source_path === undefined) {
		http_error(HTTP_STATUS.NOT_FOUND, 'Source image not found')
	}

	return await convert_and_save_image(source_path, destination_path)
}

async function process_image_request(filename: string): Promise<Response> {
	const images_directory = get_images_directory()
	const base_name = path.basename(filename, WEBP_EXTENSION)

	const { buffer, file_path } = await get_optimized_image(images_directory, base_name)

	if (buffer !== undefined) {
		return create_response(buffer as unknown as BodyInit)
	}

	const webp_buffer = await generate_new_image(images_directory, base_name, file_path)
	return create_response(webp_buffer as unknown as BodyInit)
}

function validate_request(filename: string): void {
	if (filename === '') {
		http_error(HTTP_STATUS.BAD_REQUEST, 'Filename is required')
	}

	if (!filename.endsWith(WEBP_EXTENSION)) {
		http_error(HTTP_STATUS.BAD_REQUEST, 'Only .webp extension is supported via this API')
	}
}

function handle_error(error: unknown): never {
	if (is_http_error(error)) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw error
	}

	console.error('Image processing error:', error)
	http_error(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Internal Server Error')
}

export const GET: RequestHandler = async ({ params }) => {
	const { filename } = params

	validate_request(filename)

	try {
		return await process_image_request(filename)
	} catch (error) {
		return handle_error(error)
	}
}
