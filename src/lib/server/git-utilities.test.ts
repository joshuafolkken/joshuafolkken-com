import { beforeEach, expect, test, vi } from 'vitest'
import { git_utilities } from './git-utilities'

vi.mock('node:child_process', () => ({
	execFileSync: vi.fn(),
}))

const ISO_DATE = '2024-01-15T10:30:00+07:00'
const FILE_WITH_LEADING_SLASH = '/src/routes/+page.svelte'
const FILE_WITHOUT_LEADING_SLASH = 'src/routes/+page.svelte'

beforeEach(() => {
	vi.resetAllMocks()
})

test('get_file_lastmod returns parsed Date when git log returns a valid ISO string', async () => {
	const { execFileSync: exec_file_sync } = await import('node:child_process')

	vi.mocked(exec_file_sync).mockReturnValue(`${ISO_DATE}\n`)

	const result = git_utilities.get_file_lastmod(FILE_WITHOUT_LEADING_SLASH)

	expect(result).toBeInstanceOf(Date)
	expect(result.toISOString()).toBe(new Date(ISO_DATE).toISOString())
})

test('get_file_lastmod strips leading slash before passing path to git', async () => {
	const { execFileSync: exec_file_sync } = await import('node:child_process')

	vi.mocked(exec_file_sync).mockReturnValue(`${ISO_DATE}\n`)

	git_utilities.get_file_lastmod(FILE_WITH_LEADING_SLASH)

	expect(exec_file_sync).toHaveBeenCalledWith(
		'git',
		['log', '-1', '--format=%cI', '--', FILE_WITHOUT_LEADING_SLASH],
		{ encoding: 'utf8' },
	)
})

test('get_file_lastmod returns current Date when git command throws', async () => {
	const { execFileSync: exec_file_sync } = await import('node:child_process')

	vi.mocked(exec_file_sync).mockImplementation(() => {
		throw new Error('not a git repo')
	})

	const before = Date.now()
	const result = git_utilities.get_file_lastmod(FILE_WITHOUT_LEADING_SLASH)
	const after = Date.now()

	expect(result).toBeInstanceOf(Date)
	expect(result.getTime()).toBeGreaterThanOrEqual(before)
	expect(result.getTime()).toBeLessThanOrEqual(after)
})

test('get_file_lastmod returns current Date when git output is empty', async () => {
	const { execFileSync: exec_file_sync } = await import('node:child_process')

	vi.mocked(exec_file_sync).mockReturnValue('')

	const before = Date.now()
	const result = git_utilities.get_file_lastmod(FILE_WITHOUT_LEADING_SLASH)
	const after = Date.now()

	expect(result).toBeInstanceOf(Date)
	expect(result.getTime()).toBeGreaterThanOrEqual(before)
	expect(result.getTime()).toBeLessThanOrEqual(after)
})
