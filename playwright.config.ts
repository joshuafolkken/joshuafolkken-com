import { defineConfig, devices } from '@playwright/test'
import { E2E_DEV_PORT, E2E_PREVIEW_PORT, E2E_WORKER_COUNT } from './e2e/e2e-constants'

// 環境判定と設定値の定数化
const isCI = Boolean(process.env['CI'])
const isPR = process.env['GITHUB_EVENT_NAME'] === 'pull_request'
// const isStaging = Boolean(process.env['STAGING']) // 将来の拡張用

const APP_PORT = isCI ? E2E_PREVIEW_PORT : E2E_DEV_PORT
// `pnpm dev` の既定と揃える（127.0.0.1 だと環境によっては接続/待機がずれる）
const BASE_URL = `http://localhost:${String(APP_PORT)}`
const CI_TIMEOUT = 15_000
const LOCAL_TIMEOUT = 25_000
const TEST_TIMEOUT = 10_000
const EXPECT_TIMEOUT = 5_000
const ACTION_TIMEOUT = 5_000
const NAVIGATION_TIMEOUT = 10_000

const chrome_desktop_use = {
	...devices['Desktop Chrome'],
	viewport: { width: 1280, height: 720 },
	launchOptions: {
		args: ['--disable-dev-shm-usage', '--disable-gpu', ...(isCI ? ['--no-sandbox'] : [])],
	},
}

// 環境に応じた設定を関数化
const getWebServerConfig = () => {
	if (isCI) {
		return {
			command: 'pnpm run preview:ci',
			url: BASE_URL,
			timeout: CI_TIMEOUT,
			reuseExistingServer: false,
			env: { E2E_CLEANUP_ENABLED: '1' },
		}
	}
	// 将来的に staging 環境を追加する場合
	// if (isStaging) { ... }
	// kill-port in test:e2e script frees the port before this runs
	return {
		command: 'pnpm run dev',
		url: BASE_URL,
		timeout: LOCAL_TIMEOUT,
		reuseExistingServer: true,
		env: { E2E_CLEANUP_ENABLED: '1' },
	}
}

export default defineConfig({
	globalSetup: './e2e/global-setup',
	globalTeardown: './e2e/global-teardown',
	webServer: getWebServerConfig(),
	testDir: 'e2e',
	// Per-worker auth isolation lets every test run independently.
	fullyParallel: true,
	// Per-worker test users provide full DB isolation — each worker runs against its own account.
	workers: E2E_WORKER_COUNT,
	// リトライ設定（CI でのみ有効、ローカルでは即座に失敗を確認）
	retries: isCI ? 2 : 0,
	// タイムアウト設定を最適化
	timeout: TEST_TIMEOUT,
	expect: {
		timeout: EXPECT_TIMEOUT,
	},
	// `e2e-guest`: 未認証のまま `page` を使うテスト（`storageState` なし）
	// `e2e-main` / `e2e-leak-check`: worker-fixtures.ts が worker ごとの storageState を注入
	projects: [
		{
			name: 'e2e-guest',
			testMatch: /\/(dash-guest|demo)\.test\.ts$/u,
			timeout: 45_000,
			use: chrome_desktop_use,
		},
		{
			name: 'e2e-main',
			timeout: 60_000,
			dependencies: ['e2e-guest'],
			testIgnore: /dash-leak-check\.test\.ts|dash-guest\.test\.ts|demo\.test\.ts/u,
			use: chrome_desktop_use,
		},
		// leak-check は PR では実行しない（main へのプッシュ時のみ）
		...(isPR
			? []
			: [
					{
						name: 'e2e-leak-check',
						testMatch: /dash-leak-check\.test\.ts/u,
						timeout: 180_000,
						dependencies: ['e2e-main'],
						use: chrome_desktop_use,
					},
				]),
	],
	// レポート設定
	reporter: isCI ? [['html'], ['github']] : [['html'], ['list']],
	// グローバル設定
	use: {
		baseURL: BASE_URL,
		// アクションのタイムアウト
		actionTimeout: ACTION_TIMEOUT,
		// ナビゲーションのタイムアウト
		navigationTimeout: NAVIGATION_TIMEOUT,
		// スクリーンショットは失敗時のみ（CI でのみ）
		screenshot: isCI ? 'only-on-failure' : 'off',
		// ビデオは失敗時のみ（CI でのみ）
		video: isCI ? 'retain-on-failure' : 'off',
		// トレースは失敗時のみ（CI でのみ）
		trace: isCI ? 'retain-on-failure' : 'off',
	},
})
