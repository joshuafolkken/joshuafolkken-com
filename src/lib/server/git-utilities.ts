import { execSync } from 'node:child_process'

function get_file_lastmod(path: string): Date {
	try {
		// ファイルパスはプロジェクトルート相対（例: src/routes/+page.svelte）になっている前提
		// 先頭の / を削除して git コマンドに渡す
		const relative_path = path.startsWith('/') ? path.slice(1) : path

		// git log でそのファイルの最終コミット日時を取得 (ISO 8601形式)
		// eslint-disable-next-line sonarjs/os-command
		const stdout = execSync(`git log -1 --format=%cI -- "${relative_path}"`, {
			encoding: 'utf8',
		})

		if (stdout.trim() !== '') {
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
