import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'

// Remote bindings (e.g. AI Search, which has no local emulation) make wrangler open a remote
// proxy session. Opt in with REMOTE_BINDINGS=true to use them from `pnpm dev` — that path also
// needs Cloudflare Access service-token env vars (CLOUDFLARE_ACCESS_CLIENT_ID / _SECRET) because
// the *.workers.dev domain is behind Access. Default off keeps build/dev/CI token-free.
const use_remote_bindings = process.env['REMOTE_BINDINGS'] === 'true'

// Content-Security-Policy — single-sourced here, deliberately NOT in `_headers` or as a
// hand-built header in `src/hooks.server.ts`. SvelteKit emits its own inline hydration
// `<script>` on every rendered page, so a policy without `'unsafe-inline'` only works when
// SvelteKit itself can stamp the per-request nonce onto that script — which only `kit.csp`
// does. Two sources would mean one of them silently loses the nonce, so the header is owned
// exclusively by SvelteKit and `hooks.server.ts` no longer sets it.
//
// Keywords (`self`, `none`, `unsafe-inline`) are written unquoted: SvelteKit quotes them.
//
// `style-src` keeps `'unsafe-inline'` on purpose — Svelte transitions write inline `<style>`
// at runtime. That also keeps SvelteKit from adding a style nonce, which would make CSP3
// browsers ignore `'unsafe-inline'` and break those transitions.
//
// The ad/analytics origins below each appear in several directives, so they are named once:
// Google moves these hosts around, and a rename has to land everywhere or the policy silently
// drifts out of sync with what the tag actually requests.
const DOUBLE_CLICK = 'https://*.doubleclick.net'
const GOOGLE_SYNDICATION = 'https://*.googlesyndication.com'
// AdSense ad-traffic-quality beacons and frames (ep1/ep2.adtrafficquality.google).
const AD_TRAFFIC_QUALITY = 'https://*.adtrafficquality.google'
const GOOGLE_ANALYTICS = 'https://*.google-analytics.com'
const GOOGLE_TAG_MANAGER = 'https://www.googletagmanager.com'

/** @type {import('@sveltejs/kit').KitConfig['csp']} */
const csp = {
	// nonce for server-rendered pages, hashes when prerendering. No page route prerenders
	// today (only the sitemap / search-index endpoints do), so this resolves to nonce mode.
	// Note: `src/app.html` carries `%sveltekit.nonce%`, and SvelteKit hard-fails the build if a
	// *page* is ever prerendered while that placeholder is present — a build error, not a silent
	// downgrade. Adding `export const prerender = true` to a page means reworking those inline
	// scripts (external file or hashes) first.
	mode: 'auto',
	directives: {
		'default-src': ['self'],
		'script-src': ['self', GOOGLE_TAG_MANAGER, GOOGLE_SYNDICATION, DOUBLE_CLICK],
		// Inline event-handler *attributes* only — this is not `script-src`, so injected
		// `<script>` blocks stay blocked. Svelte 5's SSR event replay stamps `onload="this.__e=event"`
		// onto an element so a load/error event firing before hydration is not lost. It does this
		// only for `onload`/`onerror` on the load/error elements (body embed iframe img link object
		// script style track) — never for `onclick` or ordinary interactive elements. This site has
		// exactly one such handler: the non-blocking webfont `<link media="print" onload=...>` in
		// `src/routes/+layout.svelte`. Without this directive that attribute falls back to
		// `script-src` and the font media swap is blocked.
		// The one path that renders untrusted HTML (chat markdown) strips handlers via DOMPurify.
		// Removing that single `onload` retires this directive — tracked in #799.
		'script-src-attr': ['unsafe-inline'],
		'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
		'font-src': ['self', 'https://fonts.gstatic.com'],
		'img-src': [
			'self',
			'data:',
			'https://*.opencollective.com',
			GOOGLE_ANALYTICS,
			GOOGLE_SYNDICATION,
			DOUBLE_CLICK,
			AD_TRAFFIC_QUALITY,
			'https://ssl.gstatic.com',
		],
		'connect-src': [
			'self',
			GOOGLE_ANALYTICS,
			'https://api.opencollective.com',
			GOOGLE_TAG_MANAGER,
			DOUBLE_CLICK,
			'https://region1.analytics.google.com',
			AD_TRAFFIC_QUALITY,
		],
		// AdSense frames ad-traffic-quality and google.com endpoints alongside the syndication
		// ones; without them the ad slot logs CSP violations on every post.
		'frame-src': [
			GOOGLE_SYNDICATION,
			DOUBLE_CLICK,
			AD_TRAFFIC_QUALITY,
			'https://www.google.com',
			'https://www.youtube-nocookie.com',
		],
		'object-src': ['none'],
		'base-uri': ['self'],
		'form-action': ['self'],
		'frame-ancestors': ['none'],
	},
}

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

	kit: {
		adapter: adapter({ platformProxy: { remoteBindings: use_remote_bindings } }),
		csp,
	},
	extensions: ['.svelte', '.svx', '.md'],
}

export default config
