import { execFileSync } from 'node:child_process'

function get_file_lastmod(path: string): Date {
	try {
		const relative_path = path.startsWith('/') ? path.slice(1) : path

		// eslint-disable-next-line sonarjs/no-os-command-from-path
		const stdout = execFileSync('git', ['log', '-1', '--format=%cI', '--', relative_path], {
			encoding: 'utf8',
		})

		if (stdout.trim()) {
			return new Date(stdout.trim())
		}
	} catch {
		// Gitコマンドが失敗した場合や、まだコミットされていないファイルの場合は無視
	}

	// 取得できなかった場合は現在日時（ビルド日時）を返す
	return new Date()
}

export const git_utilities = {
	get_file_lastmod,
}
