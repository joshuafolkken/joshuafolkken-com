import { error } from '@sveltejs/kit'
import { ERROR_MESSAGES, HTTP_STATUS } from '$lib/constants/http'
import { project_utilities } from '$lib/utils/project-utilities'
import type { PageLoad } from './$types'

function throw_not_found(): never {
	/* eslint-disable-next-line @typescript-eslint/only-throw-error -- SvelteKit error() throws HttpError */
	throw error(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND)
}

export const load: PageLoad = ({ params }) => {
	const project = project_utilities.get_project_by_slug(params.slug)

	if (!project) {
		throw_not_found()
	}

	return {
		project,
		case_study: project_utilities.get_case_study(project.slug),
		slug: project.slug,
	}
}
