import { beforeEach, describe, expect, it, vi } from 'vitest'
import { git_command } from './git-command'
import { git_prompt } from './git-prompt'
import { git_staging } from './git-staging'
import { git_status } from './git-status'

vi.mock('./git-command', () => ({
	git_command: {
		add_tracked: vi.fn(),
	},
}))

vi.mock('./git-status', () => ({
	git_status: {
		check_unstaged: vi.fn(),
		check_branch_version: vi.fn().mockResolvedValue(true),
	},
}))

vi.mock('./git-prompt', () => ({
	git_prompt: {
		confirm_unstaged_files: vi.fn(),
	},
}))

describe('git_staging.check_and_confirm_staging', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('auto-stages tracked files when force=true and unstaged files exist', async () => {
		vi.mocked(git_status.check_unstaged).mockResolvedValueOnce(true)

		await git_staging.check_and_confirm_staging(true)

		expect(git_command.add_tracked).toHaveBeenCalledOnce()
		expect(git_prompt.confirm_unstaged_files).not.toHaveBeenCalled()
	})

	it('prompts user when force=false and unstaged files exist', async () => {
		vi.mocked(git_status.check_unstaged).mockResolvedValueOnce(true)

		await git_staging.check_and_confirm_staging(false)

		expect(git_prompt.confirm_unstaged_files).toHaveBeenCalledOnce()
		expect(git_command.add_tracked).not.toHaveBeenCalled()
	})

	it('skips staging when no unstaged files exist', async () => {
		vi.mocked(git_status.check_unstaged).mockResolvedValueOnce(false)

		await git_staging.check_and_confirm_staging(true)

		expect(git_command.add_tracked).not.toHaveBeenCalled()
		expect(git_prompt.confirm_unstaged_files).not.toHaveBeenCalled()
	})
})
