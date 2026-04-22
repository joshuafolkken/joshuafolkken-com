const PADDING_LINK_CLEARANCE = 'pb-16'
const PADDING_SECTION_DEFAULT = 'pb-6'
const PADDING_BEFORE_EXTERNAL_TAGS = 'pb-2'

function padding_when_tags_inside(has_secondary_link: boolean): string {
	return has_secondary_link ? PADDING_LINK_CLEARANCE : ''
}

function padding_when_tags_outside(has_secondary_link: boolean, has_tag_list: boolean): string {
	if (has_tag_list) {
		return PADDING_BEFORE_EXTERNAL_TAGS
	}

	return has_secondary_link ? PADDING_LINK_CLEARANCE : PADDING_SECTION_DEFAULT
}

/** Bottom padding for the project card body column (link row clearance vs tag row). */
function get_card_body_padding(
	should_include_tags: boolean,
	has_secondary_link: boolean,
	has_tag_list: boolean,
): string {
	if (should_include_tags) {
		return padding_when_tags_inside(has_secondary_link)
	}

	return padding_when_tags_outside(has_secondary_link, has_tag_list)
}

/** Extra layout classes for tag row placed outside the demo link (body `p-6` alignment). */
function get_demo_tag_row_class(has_secondary_link: boolean): string {
	return `px-6 ${has_secondary_link ? PADDING_LINK_CLEARANCE : PADDING_SECTION_DEFAULT}`
}

export { get_card_body_padding, get_demo_tag_row_class }
