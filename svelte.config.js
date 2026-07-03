import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'

// Remote bindings (e.g. AI Search, which has no local emulation) make wrangler open a remote
// proxy session. Opt in with REMOTE_BINDINGS=true to use them from `pnpm dev` — that path also
// needs Cloudflare Access service-token env vars (CLOUDFLARE_ACCESS_CLIENT_ID / _SECRET) because
// the *.workers.dev domain is behind Access. Default off keeps build/dev/CI token-free.
const use_remote_bindings = process.env['REMOTE_BINDINGS'] === 'true'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		/** @type {import('svelte/compiler').PreprocessorGroup} */ (
			mdsvex({
				extensions: ['.svx', '.md'],
			})
		),
	],

	kit: { adapter: adapter({ platformProxy: { remoteBindings: use_remote_bindings } }) },
	extensions: ['.svelte', '.svx', '.md'],
}

export default config
