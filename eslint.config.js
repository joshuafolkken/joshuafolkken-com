import { create_sveltekit_config } from '@joshuafolkken/app-kit/eslint/sveltekit'
import svelteConfig from './svelte.config.js'

export default create_sveltekit_config({
	gitignore_path: new URL('./.gitignore', import.meta.url),
	tsconfig_root_dir: import.meta.dirname,
	svelte_config: svelteConfig,
})
