import { defineConfig } from '@playwright/test'

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		timeout: process.env.CI ? 15_000 : 5_000,
	},
	testDir: 'e2e',
	fullyParallel: true,
})
