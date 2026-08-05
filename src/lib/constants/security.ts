const LOCALHOST_HOSTNAMES: ReadonlySet<string> = new Set(['localhost', '127.0.0.1'])

const HSTS_VALUE = 'max-age=31536000; includeSubDomains'

const PERMISSIONS_POLICY_VALUE = 'camera=(), microphone=(), geolocation=(), payment=()'

// `same-origin`, not `same-origin-allow-popups`: nothing here needs an opener. There is no
// `window.open` and no `window.opener` read anywhere in src/, and the social share links are
// plain <a target="_blank" rel="noopener noreferrer"> — the opener is severed already, so the
// stricter value costs nothing and closes the cross-window channel (tabnabbing, XS-Leaks)
// that ZAP 90004's COOP sub-alert reports (#803).
const COOP_VALUE = 'same-origin'

// What this site layers on top of app-kit's baseline, in the shape `apply_security_headers` takes.
// It lives here, rather than inline in the server hook, so the hook and the security-headers E2E
// read the same array: one drives the headers actually served, the other drives what the spec
// expects. Passing it to both is what makes the stronger Permissions-Policy above read as the
// deliberate override it is instead of a departure from the baseline, and it puts the added HSTS
// header under the same assertion (app-kit#154).
const SECURITY_HEADERS_EXTRA = [
	['Permissions-Policy', PERMISSIONS_POLICY_VALUE],
	['Strict-Transport-Security', HSTS_VALUE],
	['Cross-Origin-Opener-Policy', COOP_VALUE],
] as const satisfies ReadonlyArray<readonly [string, string]>

// No CSP constant here on purpose: the policy is single-sourced in `kit.csp` (svelte.config.js)
// so SvelteKit can stamp a per-request nonce onto its own inline hydration script. See the
// comment there before adding a CSP header back to `src/lib/server/security.ts`.

export {
	LOCALHOST_HOSTNAMES,
	HSTS_VALUE,
	PERMISSIONS_POLICY_VALUE,
	COOP_VALUE,
	SECURITY_HEADERS_EXTRA,
}
