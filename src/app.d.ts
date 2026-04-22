// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env
			ctx: ExecutionContext
			caches: CacheStorage
			cf?: IncomingRequestCfProperties
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}
}

declare module '*.md' {
	import type { Component } from 'svelte'
	const component: Component
	export default component
	export const metadata: Record<string, unknown>
}

declare global {
	interface ImportMetaEnv {
		readonly APP_VERSION: string
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv
	}
}

export {}
