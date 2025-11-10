import { defineConfig } from '@playwright/test'

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		timeout: 5000,
	},
	testDir: 'e2e',
	fullyParallel: true,
})
