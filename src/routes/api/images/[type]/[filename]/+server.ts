import { error as http_error } from '@sveltejs/kit'
import { HTTP_HEADERS, HTTP_STATUS } from '$lib/constants/http'
import { image_service } from '$lib/server/image-service'
import type { RequestHandler } from './$types'

const CACHE_CONTROL = 'public, max-age=31536000'
const VALID_IMAGE_TYPES = ['blog', 'projects'] as const
type ImageType = (typeof VALID_IMAGE_TYPES)[number]

function create_response(buffer: Buffer, content_type: string): Response {
	return new Response(buffer as unknown as BodyInit, {
		headers: {
			[HTTP_HEADERS.CONTENT_TYPE]: content_type,
			'Cache-Control': CACHE_CONTROL,
		},
	})
}

function validate_image_type(type: string): type is ImageType {
	return VALID_IMAGE_TYPES.includes(type as ImageType)
}

function validate_request(filename: string): void {
	if (filename === '') {
		http_error(HTTP_STATUS.BAD_REQUEST, 'Filename is required')
	}

	if (!filename.endsWith(image_service.webp_extension)) {
		http_error(HTTP_STATUS.BAD_REQUEST, 'Only .webp extension is supported via this API')
	}
}

function handle_image_error(error: unknown): never {
	console.error('Image processing error:', error)
	if (error instanceof Error && error.message === image_service.error_source_image_not_found) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw http_error(HTTP_STATUS.NOT_FOUND, image_service.error_source_image_not_found)
	}
	// eslint-disable-next-line @typescript-eslint/only-throw-error
	throw http_error(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Internal Server Error')
}

export const GET: RequestHandler = async ({ params }) => {
	const { type, filename } = params

	if (!validate_image_type(type)) {
		http_error(
			HTTP_STATUS.BAD_REQUEST,
			`Invalid image type. Must be one of: ${VALID_IMAGE_TYPES.join(', ')}`,
		)
	}

	validate_request(filename)

	try {
		const { buffer, content_type } = await image_service.get_optimized_image(filename, type)
		return create_response(buffer, content_type)
	} catch (error) {
		return handle_image_error(error)
	}
}
