import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { type Plugin, type ResolvedConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
// import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import pkg from './package.json'

const IS_CI = Boolean(process.env['CI'])

function make_stats_plugin(filename: string, is_ssr: boolean): Plugin {
	let active = false
	const viz = visualizer({ open: !IS_CI, filename })
	const viz_generate = typeof viz.generateBundle === 'function' ? viz.generateBundle : null

	return {
		name: `visualizer-${is_ssr ? 'server' : 'client'}`,
		apply: 'build',
		configResolved(config: ResolvedConfig) {
			active = !!config.build.ssr === is_ssr
		},
		async generateBundle(options, bundle, isWrite) {
			if (active && viz_generate)
				await Reflect.apply(viz_generate, this, [options, bundle, isWrite])
		},
	}
}

export default defineConfig({
	define: {
		'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
	},
	plugins: [
		imagetools({
			defaultDirectives: () =>
				new URLSearchParams({ format: 'webp', w: '1344', h: '2016', fit: 'inside' }),
		}),
		tailwindcss(),
		sveltekit(),
		make_stats_plugin('stats-client.html', false),
		make_stats_plugin('stats-server.html', true),
	],
	server: {
		allowedHosts: ['.trycloudflare.com'],
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			// {
			// 	extends: './vite.config.ts',
			// 	test: {
			// 		name: 'client',
			// 		browser: {
			// 			enabled: true,
			// 			provider: playwright(),
			// 			instances: [{ browser: 'chromium', headless: true }],
			// 		},
			// 		include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
			// 		exclude: ['src/lib/server/**'],
			// 	},
			// },
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					// Root-level entry covers config files (e.g. svelte.config.test.ts), which the
					// project convention colocates beside the file they test.
					include: ['src/**/*.{test,spec}.{js,ts}', '*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
				},
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'scripts',
					environment: 'node',
					include: ['scripts/**/*.{test,spec}.{js,ts}'],
				},
			},
		],
	},
})
