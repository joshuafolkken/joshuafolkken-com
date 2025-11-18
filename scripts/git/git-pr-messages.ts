function display_success_message(): void {
	console.info('')
	console.info('✅ Status checks completed.')
	console.info('')
	console.info('✅ All checks passed successfully.')
	console.info('')
	console.info('PR is ready for review.')
	console.info('')
}

function display_error_message(): void {
	console.info('')
	console.info('⚠️  PR has conflicts or merge issues.')
	console.info('')
}

function display_merged_pr_message(): void {
	console.info('')
	console.info('ℹ️  Existing PR is already merged. Creating a new PR...')
	console.info('')
}

function display_pr_exists_message(): void {
	console.info('')
	console.info('ℹ️  Pull request already exists.')
	console.info('')
}

const git_pr_messages = {
	display_success_message,
	display_error_message,
	display_merged_pr_message,
	display_pr_exists_message,
}

export { git_pr_messages }
