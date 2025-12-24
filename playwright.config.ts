import { defineConfig } from '@playwright/test'

export default defineConfig({
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		port: 4173,
		timeout: process.env['CI'] ? 15_000 : 25_000,
	},
	testDir: 'e2e',
	fullyParallel: true,
})
