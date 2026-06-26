import { search_index } from '$lib/utils/search-index'
import type { RequestHandler } from './$types'

const GET: RequestHandler = () => {
	const documents = search_index.build_search_documents()

	return Response.json(documents)
}

// SvelteKit configuration

// eslint-disable-next-line unicorn/consistent-boolean-name -- `prerender` is a SvelteKit reserved page-option export; the name is fixed
const prerender = true

export { GET, prerender }
