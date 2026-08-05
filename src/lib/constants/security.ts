const LOCALHOST_HOSTNAMES: ReadonlySet<string> = new Set(['localhost', '127.0.0.1'])

const HSTS_VALUE = 'max-age=31536000; includeSubDomains'

const PERMISSIONS_POLICY_VALUE = 'camera=(), microphone=(), geolocation=(), payment=()'

// No Cross-Origin-Opener-Policy entry here: app-kit's baseline applies `same-origin` itself as of
// 0.71.0 (app-kit#164, raised upstream from this site's #803), so listing it again would be a
// second source for one value. The stricter `same-origin` — rather than
// `same-origin-allow-popups` — is still the right fit for this site, which is why no override
// appears below: there is no `window.open` and no `window.opener` read anywhere in src/, and the
// share links are plain <a target="_blank" rel="noopener noreferrer">, so nothing here needs an
// opener. An override would only become correct if a popup flow arrived; `security.test.ts` pins
// the served value so an upstream relaxation cannot weaken this site silently.

// What this site layers on top of app-kit's baseline, in the shape `apply_security_headers` takes.
// It lives here, rather than inline in the server hook, so the hook and the security-headers E2E
// read the same array: one drives the headers actually served, the other drives what the spec
// expects. Passing it to both is what makes the stronger Permissions-Policy above read as the
// deliberate override it is instead of a departure from the baseline, and it puts the added HSTS
// header under the same assertion (app-kit#154).
const SECURITY_HEADERS_EXTRA = [
	['Permissions-Policy', PERMISSIONS_POLICY_VALUE],
	['Strict-Transport-Security', HSTS_VALUE],
] as const satisfies ReadonlyArray<readonly [string, string]>

// No CSP constant here on purpose: the policy is single-sourced in `kit.csp` (svelte.config.js)
// so SvelteKit can stamp a per-request nonce onto its own inline hydration script. See the
// comment there before adding a CSP header back to `src/lib/server/security.ts`.

export { LOCALHOST_HOSTNAMES, HSTS_VALUE, PERMISSIONS_POLICY_VALUE, SECURITY_HEADERS_EXTRA }
