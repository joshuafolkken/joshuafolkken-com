const PADDING_GITHUB_CLEARANCE = 'pb-16'
const PADDING_SECTION_DEFAULT = 'pb-6'
const PADDING_BEFORE_EXTERNAL_TAGS = 'pb-2'

function padding_when_tags_inside(has_github: boolean): string {
	return has_github ? PADDING_GITHUB_CLEARANCE : ''
}

function padding_when_tags_outside(has_github: boolean, has_tag_list: boolean): string {
	if (has_tag_list) {
		return PADDING_BEFORE_EXTERNAL_TAGS
	}

	return has_github ? PADDING_GITHUB_CLEARANCE : PADDING_SECTION_DEFAULT
}

/** Bottom padding for the project card body column (GitHub badge clearance vs tag row). */
function get_card_body_padding(
	should_include_tags: boolean,
	has_github: boolean,
	has_tag_list: boolean,
): string {
	if (should_include_tags) {
		return padding_when_tags_inside(has_github)
	}

	return padding_when_tags_outside(has_github, has_tag_list)
}

/** Extra layout classes for tag row placed outside the demo link (body `p-6` alignment). */
function get_demo_tag_row_class(has_github: boolean): string {
	return `px-6 ${has_github ? PADDING_GITHUB_CLEARANCE : PADDING_SECTION_DEFAULT}`
}

export { get_card_body_padding, get_demo_tag_row_class }
